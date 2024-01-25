<script>
	// import Logo from './Logo.svelte'
	import Search from './Search.svelte';
	import Type from './Type.svelte';

	export let message = '';

	let type = 'ALL';
</script>

<header class="appbar block h-32 lg:h-16 w-screen fixed top-0 left-0 z-30">
	<div
		class="h-32 lg:h-16 flex flex-col lg:flex-row items-center my-0 mx-0 lg:mx-auto max-w-full w-screen lg:w-lg"
	>
		<!-- <Logo /> -->
		<Search {type} />
		<Type bind:type />
		<div class="flex-grow flex items-center justify-end">
			<svg height="50" width="30" class="market-circle">
				<circle cx="15" cy="25" r="5" />
			</svg>
			<span>{message}</span>
		</div>
	</div>
</header>
