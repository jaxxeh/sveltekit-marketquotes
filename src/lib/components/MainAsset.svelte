<script>
	import { operationStore, query } from '@urql/svelte';
	import { GET_PROFILE } from '$lib/queries';
	import Ticker from '$lib/components/Ticker.svelte';
	import ChartWrapper from '$lib/components/ChartWrapper.svelte';

	export let asset;
	export let ticker;

	const profile = operationStore(
		GET_PROFILE,
		{ symbol: '' },
		{ requestPolicy: 'cache-and-network' }
	);

	query(profile);

	$: price =
		$ticker.data && $ticker.data[asset.symbol] > 0.0
			? $ticker.data[asset.symbol]
			: asset.regularMarketPrice;
	$: refreshProfile(asset);
	$: asset.profile = $profile.fetching || $profile.error ? {} : $profile.data.profile;
	$: name = asset.profile?.longName || asset.shortName;
	$: currencySymbol = asset.profile?.currencySymbol || '$';

	function refreshProfile({ symbol }) {
		if ($profile.variables['symbol'] !== symbol) {
			$profile.variables = { symbol };
		}
	}
</script>

{#if $profile.fetching}
	<p>Loading...</p>
{:else if $profile.error}
	<p>Error</p>
{:else if asset.profile}
	<div class="asset">
		<header class="flex justify-between items-start flex-wrap">
			<h1 class="font-semibold tracking-tight">
				<span class="symbol mr-2">[{asset.symbol}]</span>{name}
			</h1>
			<span class="stock-classification uppercase"
				>{asset.profile.quoteType}<span class="sep mx-2">|</span>{asset.profile.exchangeName}</span
			>
		</header>
		<section class="w-full block mb-11">
			<header class="block mb-3">
				<Ticker {price} priceHint={asset.priceHint} {currencySymbol} height={30} />
				<!-- <PriceChange /> -->
			</header>
			<ChartWrapper symbol={asset.symbol} />
			<!-- <ChartSelector selected={$utilsStore.chartPeriod} /> -->
		</section>
	</div>
{/if}

<style>
	.asset {
		flex: 0 0 100%;
		display: block;
	}

	.asset header h1 {
		font-size: 30px;
		line-height: 35px;
		margin: 0;
	}
</style>
