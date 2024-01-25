import { writable } from 'svelte/store';

const utilsStore = writable({
	marketOpen: true,
	marketOpenTimestamp: 0,
	stockUp: true,
	chartHover: false,
	chartPeriod: 'ONE_DAY'
});

export default utilsStore;
