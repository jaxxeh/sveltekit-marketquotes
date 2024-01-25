<script context="module">
	import { get, readable } from 'svelte/store';
	import { browser as isClient } from '$app/env';
	import {
		createClient,
		subscriptionExchange,
		ssrExchange,
		dedupExchange,
		fetchExchange,
		operationStore
	} from '@urql/svelte';
	import { devtoolsExchange } from '@urql/devtools';
	import { cacheExchange } from '@urql/exchange-graphcache';
	import ws from 'ws';
	import * as stws from 'subscriptions-transport-ws';

	export async function load({ fetch }) {
		const subscriptionClient = new stws.SubscriptionClient(
			import.meta.env.VITE_GRAPHQL_WS,
			{ reconnect: true },
			isClient ? WebSocket : ws
		);

		const ssr = ssrExchange({
			isClient,
			initialState: isClient ? window['__URQL_DATA__'] : undefined
		});

		const client = createClient({
			fetch,
			url: import.meta.env.VITE_GRAPHQL_URL,
			preferGetMethod: false,
			exchanges: [
				devtoolsExchange,
				dedupExchange,
				cacheExchange({
					keys: {
						MarketStatus: () => null,
						Duration: () => null,
						Totals: () => null,
						MarketData: () => null
					}
				}),
				ssr,
				fetchExchange,
				subscriptionExchange({
					forwardSubscription(operation) {
						return subscriptionClient.request(operation);
					}
				})
			]
		});

		return {
			props: {
				client
			},
			stuff: {
				client,
				query: async (query, variables, context, normalize) => {
					const store = operationStore(query, variables, context);
					const result = await client
						.query(store.query, store.variables, store.context)
						.toPromise();
					Object.assign(get(store), result);
					// Allow to access deep nested object directly at data
					if (normalize) {
						const { subscribe } = store;
						return Object.create(store, {
							subscribe: {
								enumerable: true,
								value: readable(store, (set) => {
									const unsubscribe = subscribe((result) => {
										if (result.data) {
											Object.assign(result.data, normalize(result.data, result));
										}
										set(result);
									});
									return unsubscribe;
								}).subscribe
							}
						});
					}
					return store;
				}
			}
		};
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { setClient, query } from '@urql/svelte';
	import '../tailwind.css';
	import '../global.scss';
	import utilsStore from '$lib/stores/utilsStore';
	import AppBar from '$lib/components/AppBar.svelte';
	import { GET_MARKET_STATUS } from '$lib/queries';

	export let client;

	setClient(client);

	const marketStatus = operationStore(GET_MARKET_STATUS);

	query(marketStatus);

	onMount(async () => {
		// disclaimerStore.useSessionStorage()
		const marketStatusInterval = setInterval(() => {
			marketStatus.reexecute({ requestPolicy: 'cache-and-network' });
		}, 60 * 1000);

		return () => clearInterval(marketStatusInterval);
	});

	$: $utilsStore.marketOpen =
		!$marketStatus.fetching && $marketStatus.data.marketStatus.status === 'open';
	$: message = $marketStatus.fetching ? '' : $marketStatus.data.marketStatus.message;
	$: open = $utilsStore.marketOpen;
	$: closed = !open;
	$: up = $utilsStore.stockUp;
	$: down = !up;
</script>

<div class="m-0 p-0">
	{#if !$marketStatus.fetching}
		<main class:up class:down class:open class:closed class="block">
			<!-- {#if $disclaimerStore}
        <Disclaimer />
      {/if} -->
			<div class="flex flex-column relative justify-between min-h-screen">
				<AppBar {message} />
				<div class="flex flex-grow">
					<div class="flex flex-column flex-grow pt-16 mb-2 lg:min-w-lg">
						<div class="w-full">
							<main class="main-container lg:pt-9 mx-auto my-0 block lg:w-lg">
								<slot />
							</main>
						</div>
					</div>
				</div>
			</div>
		</main>
	{/if}
</div>
