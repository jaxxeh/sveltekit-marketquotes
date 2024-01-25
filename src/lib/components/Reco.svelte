<script>
	import { operationStore, query } from '@urql/svelte';
	import { GET_PROFILE } from '$lib/queries';
	import Ticker from '$lib/components/Ticker.svelte';

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
	$: refreshProfile(asset.symbol);
	$: asset.profile = $profile.fetching || $profile.error ? {} : $profile.data.profile;
	$: name = asset.profile?.longName || asset.shortName;
	$: currencySymbol = asset.profile?.currencySymbol || '$';

	function refreshProfile(symbol) {
		if ($profile.variables['symbol'] !== symbol) {
			$profile.variables = { symbol };
		}
	}
</script>

{#if $profile.fetching}
	<p>Loading...</p>
{:else}
	<div class="reco block p-0">
		<a class="reco-link" href={`/quote/${asset.symbol}`}>
			<div
				class="reco-card flex flex-col justify-between overflow-hidden border rounded box-border"
			>
				<div>
					<p class="reco-symbol">{asset.symbol}</p>
					<p class="reco-name">{name}</p>
				</div>
				<div class={`reco-dir`}>
					<h2 class="reco-price">
						<Ticker {price} priceHint={asset.priceHint} {currencySymbol} height={20} />
					</h2>
					<!-- <span class="reco-change">{reco.change}</span> -->
				</div>
			</div>
		</a>
	</div>
{/if}

<style>
	.reco-link {
		color: inherit;
		text-decoration: inherit;
		background-color: transparent;
	}

	.reco-card {
		height: 160px;
		padding: 22px 23px;
		transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
	}

	.reco-symbol {
		font-size: 18px;
		font-weight: 500;
		margin-bottom: 4px;
		max-height: 6ex;
		overflow: hidden;
	}

	.reco-name {
		font-weight: 400;
		font-size: 12px;
		line-height: 15px;
	}

	.reco-dir.up {
		color: #21ce99;
	}
	.reco-dir.down {
		color: #f45531;
	}

	.reco-price {
		font-family: 'Open Sans';
		margin-bottom: 4px;
	}

	.reco-change {
		font-family: 'Open Sans';
	}
</style>
