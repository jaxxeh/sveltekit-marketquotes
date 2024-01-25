module.exports = {
	theme: {
		extend: {
			fontFamily: {
				numbers: [
					'Open Sans',
					'Menlo',
					'Monaco',
					'Consolas',
					'Liberation Mono',
					'Courier New',
					'monospace'
				]
			},
			spacing: {
				'1/2': '0.125rem',
				'3/2': '0.375rem',
				7: '1.75rem',
				9: '2.25rem',
				11: '2.75rem',
				13: '3.25rem',
				15: '3.75rem',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px'
			}
		}
	},
	content: ['./src/**/*.svelte']
};
