<script>
	import debounce from 'debounce';

	export let type = 'ALL';
	let hasFocus = false;
	let hasHover = false;
	const types = [
		'ALL',
		'EQUITY',
		'INDEX',
		'FUTURE',
		'MUTUALFUND',
		'ETF',
		'CURRENCY',
		'CRYPTOCURRENCY'
	];

	$: isOpen = hasFocus || hasHover;

	function clear() {
		term = '';
		hasFocus = false;
		hasHover = false;
	}
</script>

<div class="searchWrapper w-screen ml-5 px-2 lg:w-full lg:px-0">
	<div class="relative w-full h-9">
		<div class:isOpen class="select absolute w-full border border-solid rounded">
			<div
				class="select-control relative cursor-pointer h-9 w-full leading-normal outline-none"
				on:mouseenter={() => (hasHover = true)}
				on:mouseleave={() => (hasHover = false)}
				on:click={() => (hasFocus = !hasFocus)}
			>
				{#if !hasFocus}
					<div class="flex items-center h-full">
						<div
							class="select-placeholder max-w-full w-full flex items-center h-9 pr-6 whitespace-no-wrap overflow-hidden"
						>
							Type
						</div>
						<div class="current-type font-bold tracking-wide">{type}</div>
					</div>
				{:else}
					<div class="select-menu-outer border-0 shadow-none p-0 static w-full z-50 box-border">
						<div role="listbox" tabindex="-1" class="select-menu box-border overflow-y-auto">
							<div class="pt-0 box-border">
								<section class="flex flex-col items-end mt-0 mb-0">
									{#each types as t}
										<div
											class="search-result w-full py-2 cursor-pointer text-right font-bold text-gray-400 tracking-wide"
											class:selected={t === type}
											on:click={() => {
												type = t;
												debounce(() => {
													hasFocus = false;
												}, 50);
												hasHover = false;
											}}
										>
											{t}
										</div>
									{/each}
								</section>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@media (min-width: 1024px) {
		.searchWrapper {
			width: 100%;
			flex-basis: 15rem;
			min-width: 10rem;
		}
	}

	.current-type {
		margin-right: 13px;
		transition: color 150ms ease-out;
	}

	.search-result {
		padding-right: 13px;
	}

	.select {
		transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
	}

	.select-control {
		padding: 0;
		display: table;
		border-collapse: separate;
		border-spacing: 0;
		overflow: hidden;
	}

	.select-placeholder {
		line-height: 34px;
		text-overflow: ellipsis;
		transition: color 150ms ease-out;
		margin-left: 13px;
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
