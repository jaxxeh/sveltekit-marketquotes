<script>
	import { operationStore, query } from '@urql/svelte';
	import { GET_DATA } from '$lib/queries';
	import Chart from '$lib/components/Chart.svelte';

	export let symbol;
	let interval = 'ONE_DAY';

	const quoteData = operationStore(
		GET_DATA,
		{ symbol: '', interval: '' },
		{ requestPolicy: 'cache-and-network' }
	);

	query(quoteData);

	$: refreshProfile(symbol, interval);

	function refreshProfile(symbol, interval) {
		if (
			$quoteData.variables['symbol'] !== symbol ||
			$quoteData.variables['interval'] !== interval
		) {
			$quoteData.variables = { symbol, interval };
		}
	}
</script>

{#if $quoteData.fetching}
	<p>Loading...</p>
{:else if $quoteData.error}
	<p>Error</p>
{:else}
	<Chart quoteData={$quoteData.data.quoteData} />
{/if}
