<script>
	import Reco from '$lib/components/Reco.svelte';
	export let recos;
	export let ticker;
</script>

<section class="main-section block mb-15 border-t border-solid pt-2">
	<header class="block mb-6">
		<div class="about-header flex items-center">
			<div class="flex items-baseline justify-between flex-grow">
				<h2 class="about-title flex items-center m-0">Related Assets</h2>
			</div>
		</div>
	</header>
	<div class="recos-container flex items-center">
		<div class="relative w-full flex-shrink-0">
			<div class="recos-grid justify-between m-0 grid w-full gap-4">
				{#each recos as asset}
					<Reco {asset} {ticker} />
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	h2.about-title {
		font-size: 24px;
		line-height: 28px;
	}

	.recos-container {
		margin: -6px;
	}

	.recos-grid {
		grid-template-columns: repeat(5, 1fr);
	}
</style>
