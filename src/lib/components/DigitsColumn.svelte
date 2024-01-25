<script>
	import { beforeUpdate } from 'svelte';

	export let changeDir;
	export let values;
	export let xOffset;
	export let yOffset;
	export let change;

	let colorize = true;

	$: up = changeDir === 'up' && change && colorize;
	$: down = changeDir === 'down' && change && colorize;

	function trEventHandler(e) {
		if (e.propertyName === 'transform') {
			if ((e.type === 'transitionend' || e.type === 'transitioncancel') && colorize) {
				colorize = false;
				change = false;
			}
		}
	}

	beforeUpdate(() => (colorize = true));
</script>

<div
	class="absolute pointer-events-none left-0 top-0"
	style={`opacity: 1; transform: translate(${xOffset}px, 0px);`}
>
	<div class="transition-colors duration-300">
		<div
			class:up
			class:down
			class="trcol"
			style={`transform: translate(0px, -${yOffset}px)`}
			on:transitionend={trEventHandler}
			on:transitioncancel={trEventHandler}
		>
			{#each values as digit}
				<div>
					<span class="inline-block">{digit}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.trcol {
		transform: translate(0px, 0px);
		transition: transform 300ms ease-in-out, color 100ms ease-in-out;
		transition-delay: 0ms;
	}

	.up {
		color: #21ce99;
	}

	.down {
		color: #f45531;
	}
</style>
