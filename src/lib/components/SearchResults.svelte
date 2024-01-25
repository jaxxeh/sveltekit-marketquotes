<script>
	import { goto } from '$app/navigation';
	import { gql, operationStore, query } from '@urql/svelte';

	export let type = 'ALL';
	export let term = '';
	export let clear;

	const searchQuery = gql`
		query Lookup($query: String!, $type: QuoteType!) {
			lookup(query: $query, type: $type) {
				id
				totals {
					all
					equity
					future
					index
					etf
					mutualfund
					currency
					cryptocurrency
				}
				quotes {
					id
					quoteType
					symbol
					shortName
					exchange
				}
			}
		}
	`;

	const search = operationStore(
		searchQuery,
		{ query: term, type },
		{ requestPolicy: 'cache-and-network' }
	);

	query(search);

	let selectedIndex = 0;
	let searchCount = 0;
	let searchResults = [];
	let resultRefs = [];

	$: searchCount = $search.fetching ? searchCount : $search.data.lookup.totals[type.toLowerCase()];
	$: searchResults = $search.fetching ? searchResults : $search.data.lookup.quotes;
	$: refreshSearch(term, type);

	function refreshSearch(query, type) {
		if ($search.variables['query'] !== query || $search.variables['type'] !== type) {
			$search.variables = { query, type };
		}
		selectedIndex = 0;
	}

	function navToSymbol(symbol) {
		clear();
		goto(`/quote/${symbol}`);
	}

	export function handleKey(e) {
		if (!e) return;
		if (e.key === 'ArrowDown') {
			selectedIndex++;
			if (selectedIndex === searchResults.length) {
				selectedIndex = 0;
			}
			resultRefs[selectedIndex].scrollIntoView({
				block: 'nearest',
				inline: 'nearest'
			});
		}
		if (e.key === 'ArrowUp') {
			selectedIndex--;
			if (selectedIndex === -1) {
				selectedIndex = searchResults.length - 1;
			}
			resultRefs[selectedIndex].scrollIntoView({
				block: 'nearest',
				inline: 'nearest'
			});
		}
		if (e.key === 'Enter') {
			navToSymbol(searchResults[selectedIndex].symbol);
		}
		return;
	}
</script>

{#if searchCount > 0}
	{#each searchResults as result, i (result.id)}
		<div
			class:selected={selectedIndex === i}
			class="search-result box-border flex flex-col cursor-pointer outline-none"
			on:click={() => navToSymbol(result.symbol)}
			bind:this={resultRefs[i]}
		>
			<div class="flex justify-between items-start px-4 py-1">
				<div class="result-symbol box-border">
					<span class="font-semibold">
						{result.symbol}
					</span>
				</div>
				<div class="result-market box-border">
					<span class="text-gray-400 text-xs font-bold">
						{result.quoteType}<span class="sep mx-1">|</span>{result.exchange}
					</span>
				</div>
			</div>
			<div class="result-name box-border px-4 pb-2">
				<span class="text-gray-400">
					{result.shortName || 'N/A'}
				</span>
			</div>
		</div>
	{/each}
{:else}
	<div class="px-4 pt-1 pb-4">No match</div>
{/if}

<style>
	.search-result {
		border-left: 3px solid transparent;
	}
</style>
