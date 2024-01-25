<script>
	import debounce from 'debounce';
	import SearchResults from './SearchResults.svelte';

	export let type = 'ALL';
	let input;
	let hasFocus = false;
	let hasHover = false;
	let term = '';
	let results;

	$: isOpen = hasFocus || hasHover;

	function clear() {
		input.blur();
		term = '';
		hasFocus = false;
		hasHover = false;
	}
</script>

<div class="searchWrapper w-screen px-2 lg:w-full lg:px-0">
	<div class="relative w-full h-9">
		<div class:isOpen class="select absolute w-full border border-solid rounded">
			<div
				class="select-control relative cursor-text h-9 w-full leading-normal outline-none"
				on:mouseenter={() => (hasHover = true)}
				on:mouseleave={() => (hasHover = false)}
				on:click={() => input.focus()}
			>
				<div class="flex items-center h-full">
					{#if !term && !hasFocus}
						<div
							class="select-placeholder max-w-full w-full flex items-center h-9 pr-6 whitespace-no-wrap overflow-hidden"
							on:click={() => (hasFocus = true)}
						>
							Search
						</div>
					{:else}
						<div
							class="select-input inline-block items-center h-9 pr-6 whitespace-no-wrap align-middle"
						>
							<input
								class="overflow-visible m-0 inline-block shadow-none h-9 p-0 border-none bg-transparent outline-none leading-9 box-content"
								autocomplete="off"
								autocorrect="off"
								autocapitalize="none"
								spellcheck="false"
								on:focus={() => (hasFocus = true)}
								on:blur={debounce(() => (hasFocus = false), 50)}
								bind:value={term}
								bind:this={input}
								on:keyup={(e) => {
									if (results) results.handleKey(e);
								}}
							/>
						</div>
					{/if}
				</div>
			</div>
			{#if hasFocus && term.length}
				<div class="select-menu-outer border-0 shadow-none p-0 static w-full z-50 box-border">
					<div role="listbox" tabindex="-1" class="select-menu box-border overflow-y-auto">
						<div class="box-border">
							<section class="block mt-3 mb-0 max-h-96 overflow-y-auto">
								<SearchResults bind:this={results} {term} {clear} {type} />
							</section>
						</div>
					</div>
				</div>
			{/if}
		</div>
		<svg
			class="magnifier fill-current cursor-text absolute pointer-events-none"
			width="18px"
			height="18px"
			viewBox="0 0 18 18"
		>
			<g id="search" transform="translate(-11, -11)">
				<path
					d="M23.0733726,24.4447312 C21.8075531,25.4199921 20.2215106,26 18.5,26 C14.3578644,26 11,22.6421356 11,18.5 C11,14.3578644 14.3578644,11 18.5,11 C22.6421356,11 26,14.3578644 26,18.5 C26,20.2215106 25.4199921,21.8075531 24.4447312,23.0733726 L28.1425948,26.7712362 L26.7712362,28.1425948 L23.0733726,24.4447312 Z M18.5,24 C21.5375661,24 24,21.5375661 24,18.5 C24,15.4624339 21.5375661,13 18.5,13 C15.4624339,13 13,15.4624339 13,18.5 C13,21.5375661 15.4624339,24 18.5,24 Z"
					id="Combined-Shape"
				/>
			</g>
		</svg>
	</div>
</div>

<style lang="scss">
	@media (min-width: 1024px) {
		.searchWrapper {
			width: 100%;
			flex-basis: 25rem;
			min-width: 10rem;
		}
	}

	.magnifier {
		top: 10px;
		right: 10px;
		transition: fill 150ms ease-out;
	}

	.select {
		transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
	}

	.select-control {
		padding: 0 13px;
		display: table;
		border-collapse: separate;
		border-spacing: 0;
		overflow: hidden;
	}

	.select-placeholder {
		line-height: 34px;
		text-overflow: ellipsis;
		transition: color 150ms ease-out;
	}

	.select-menu-outer {
		animation: menu-animation 150ms ease-out;
		max-height: initial;
		top: 100%;
		margin-top: -1px;
	}

	.select-menu {
		max-height: initial;
	}

	@keyframes menu-animation {
		0% {
			opacity: 0;
			transform: translate(0, -2px);
		}
		100% {
			opacity: 1;
			transform: translate(0, 0);
		}
	}
</style>
