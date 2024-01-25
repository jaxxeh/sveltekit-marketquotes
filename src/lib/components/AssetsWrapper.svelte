<script>
	import { operationStore, query, subscription } from '@urql/svelte';
	import { GET_QUOTES, SUB_TICKER } from '$lib/queries';
	import MainAsset from '$lib/components/MainAsset.svelte';
	import Recos from '$lib/components/Recos.svelte';

	export let symbols;

	const quotes = operationStore(GET_QUOTES, { symbols }, { requestPolicy: 'cache-and-network' });

	query(quotes);

	const ticker = operationStore(SUB_TICKER, { symbols });

	const handleTicker = (ticker = tickerShape(symbols), data) => {
		return {
			...ticker,
			[data.quoteUpdate.symbol]: data.quoteUpdate.price
		};
	};

	subscription(ticker, handleTicker);

	$: refreshQuotes(symbols);
	$: [asset, ...recos] = $quotes.fetching || $quotes.error ? [] : $quotes.data.quotes;

	function tickerShape(symbols) {
		return symbols.reduce((obj, s) => {
			return {
				...obj,
				[s]: 0.0
			};
		});
	}

	function refreshQuotes(symbols) {
		if ($quotes.variables['symbols'] !== symbols) {
			$quotes.variables = { symbols };
		}
		if ($ticker.variables['symbols'] !== symbols) {
			$ticker.variables = { symbols };
		}
	}
</script>

{#if $quotes.fetching}
	<p>Loading...</p>
{:else}
	<MainAsset {asset} {ticker} />
	{#if recos.length > 0}
		<Recos {recos} {ticker} />
	{/if}
{/if}
