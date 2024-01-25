<script>
	import { onMount } from 'svelte';
	import { select } from 'd3-selection';
	import { scaleLinear, scaleUtc } from 'd3-scale';
	import { min, max } from 'd3-array';
	import { axisBottom, axisRight } from 'd3-axis';
	import { seriesCanvasCandlestick } from '@d3fc/d3fc-series';
	import { scaleDiscontinuous, discontinuityRange } from '@d3fc/d3fc-discontinuous-scale';

	export let quoteData;
	let chartContainer;
	let svgChart;
	let canvasCtx = undefined;
	let bandwidth = 7;
	let offset = 0;
	const margin = { top: 10, right: 50, bottom: 25, left: 10 };
	let cWidth, cHeight;

	const granularityLookup = {
		'1m': 60,
		'5m': 60 * 5,
		'15m': 60 * 15,
		'30m': 60 * 30,
		'1h': 60 * 60,
		'1d': 60 * 60 * 24,
		'1wk': 0,
		'1mo': 0,
		'3mo': 0
	};

	onMount(() => {
		cWidth = chartContainer.clientWidth - margin.left - margin.right;
		cHeight = chartContainer.clientHeight - margin.top - margin.bottom;
		chartSetup();
	});

	$: chartRender(quoteData, bandwidth, offset, canvasCtx);
	$: console.log(quoteData.data[quoteData.data.length - 1]);

	function panLeft() {
		const numbars = Math.floor(cWidth / (bandwidth * 2));
		const max = quoteData.data.length - numbars;
		const tmp = offset + 10;
		offset = tmp > max ? max : tmp;
	}

	function panRight() {
		const tmp = offset - 10;
		offset = tmp < 0 ? 0 : tmp;
	}

	function panDelta(e) {
		if (e.deltaY < 0) {
			panLeft();
		} else {
			panRight();
		}
	}

	function chartSetup() {
		const container = select('.chart-container');
		svgChart = container
			.append('svg:svg')
			.attr('width', chartContainer.clientWidth)
			.attr('height', chartContainer.clientHeight)
			.style('position', 'absolute')
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);
		const canvasChart = container
			.append('canvas')
			.attr('width', cWidth)
			.attr('height', cHeight)
			.style('margin-left', `${margin.left}px;`)
			.style('margin-top', `${margin.top}px;`)
			.style('position', 'absolute');
		canvasCtx = canvasChart.node().getContext('2d');
	}

	function chartRender(qd, bandwidth, offset, ctx) {
		if (!qd || qd.data.length <= 0 || offset < 0 || !ctx) return;
		const k = granularityLookup[qd.dataGranularity];
		const numBars = Math.floor(cWidth / (bandwidth * 2));
		const endBarIndex = qd.data.length - offset;
		const startBarIndex = endBarIndex - numBars;
		const data = qd.data.slice(startBarIndex, endBarIndex);
		const skipRanges =
			k > 0
				? data.reduce((ranges, d, i) => {
						if (i > 0 && d.timestamp - data[i - 1].timestamp > k) {
							ranges.push([
								new Date((data[i - 1].timestamp + k) * 1000),
								new Date(d.timestamp * 1000)
							]);
						}
						return ranges;
				  }, [])
				: [];
		const xScale = scaleDiscontinuous(scaleUtc())
			.discontinuityProvider(discontinuityRange(...skipRanges))
			.domain([
				new Date((data[0].timestamp - k) * 1000),
				new Date((data[numBars - 1].timestamp + k) * 1000)
			])
			.range([0, numBars * bandwidth * 2]);
		// .nice();
		const yScale = scaleLinear()
			.domain([min(data, (d) => d.low), max(data, (d) => d.high)])
			.range([cHeight, 0])
			.nice();
		ctx.clearRect(0, 0, cWidth, cHeight);
		svgChart.selectAll('.axis').remove();
		svgChart
			.append('g')
			.classed('axis', true)
			.attr('transform', `translate(0, ${cHeight})`)
			.call(axisBottom(xScale));
		svgChart
			.append('g')
			.classed('axis', true)
			.attr('transform', `translate(${cWidth}, 0)`)
			.call(axisRight(yScale));
		const candlestick = seriesCanvasCandlestick()
			.crossValue((d) => new Date(d.timestamp * 1000))
			.openValue((d) => d.open)
			.highValue((d) => d.high)
			.lowValue((d) => d.low)
			.closeValue((d) => d.close)
			.bandwidth(bandwidth)
			.xScale(xScale)
			.yScale(yScale)
			.context(ctx);
		candlestick(data);
	}
</script>

<div class="chart-container" bind:this={chartContainer} on:wheel={panDelta} />

<style>
	.chart-container {
		flex: 0 0 100%;
		display: block;
		position: relative;
		height: 325px;
		/* border: 1px solid gainsboro; */
	}
</style>
