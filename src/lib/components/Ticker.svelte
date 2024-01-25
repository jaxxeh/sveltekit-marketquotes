<script>
	import { onMount } from 'svelte';
	import DigitsColumn from '$lib/components/DigitsColumn.svelte';

	export let price;
	export let priceHint;
	export let currencySymbol;
	export let height;

	const values = `9876543210-,.`.split('');
	const sizeSample = `0-,.`.split('');
	let sampleRefs = [];
	let prices = ['', ''];
	let priceChars;
	let previousChars;
	let changeDir = 'none';
	let sizes;

	$: fmtPrice = price.toLocaleString('en-US', {
		minimumFractionDigits: priceHint,
		maximumFractionDigits: priceHint
	});
	$: lineHeight = Math.round((height * 7.0) / 6.0);
	$: updatePrice(fmtPrice);

	function updatePrice(price) {
		const [previous, _old] = prices;
		prices = [price, previous];
		priceChars = `${price}`.split('');
		previousChars = `${previous}`.split('');
		if (price === previous || previous === '') {
			changeDir = 'none';
		} else {
			changeDir =
				parseFloat(price.replace(',', '')) >= parseFloat(previous.replace(',', '')) ? 'up' : 'down';
		}
	}

	function getXOffset(index) {
		return priceChars.slice(0, index).reduce((acc, c) => {
			const k = sizeSample.includes(c) ? c : '0';
			return acc + sizes.width[k];
		}, 0);
	}

	function getYOffset(char) {
		return values.findIndex((c) => c === char) * sizes.height;
	}

	onMount(() => {
		sizes = sampleRefs.reduce(
			(obj, r, i) => {
				return {
					...obj,
					width: {
						...obj.width,
						[sizeSample[i]]: r.clientWidth
					}
				};
			},
			{ height: sampleRefs[0].clientHeight }
		);
	});
</script>

<div class="relative overflow-hidden">
	<div class="flex items-center">
		<span class="price flex" style={`font-size: ${height}px; line-height: ${lineHeight}px;`}>
			{#if sampleRefs.length > 0}
				{currencySymbol}
				<div class="relative pointer-events-none opacity-1">
					{#each priceChars as char, index (index)}
						<DigitsColumn
							{values}
							xOffset={getXOffset(index)}
							yOffset={getYOffset(char)}
							change={priceChars[index] !== previousChars[index]}
							{changeDir}
						/>
					{/each}
				</div>
			{/if}
			<div class="invisible">
				{#each sizeSample as sample, index}
					<span bind:this={sampleRefs[index]} class="inline-block">{sample}</span>
				{/each}
			</div>
		</span>
	</div>
</div>

<style>
	.price {
		font-family: 'Open Sans';
		font-weight: 300;
		/* line-height: 42px; */
		margin: 0;
		font-variant-numeric: tabular-nums;
	}
</style>
