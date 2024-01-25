<script context="module">
	import { GET_RECOS } from '$lib/queries';

	export async function load({ params, stuff }) {
		const { symbol } = params;

		return {
			props: {
				symbol,
				rec: await stuff.query(GET_RECOS, { symbol }, { requestPolicy: 'cache-and-network' })
			}
		};
	}
</script>

<script>
	import AssetsWrapper from '$lib/components/AssetsWrapper.svelte';

	export let symbol;
	export let rec;
	let recSymbols = [];

	$: recSymbols = $rec.fetching || $rec.error ? [] : $rec.data.recommend.map((q) => q.symbol);
	$: refreshRecs(symbol);

	function refreshRecs(symbol) {
		if ($rec.variables['symbol'] !== symbol) {
			$rec.variables = { symbol };
			recSymbols = [];
		}
	}
</script>

{#if $rec.fetching}
	<p>Loading...</p>
{:else}
	<AssetsWrapper symbols={[symbol, ...recSymbols]} />
{/if}
