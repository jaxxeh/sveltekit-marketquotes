# sveltekit-marketquotes

This project is meant as:

- a showcase for its accompanying GraphQL project, [yahoo-finance-graphql]()
- an example of a working [SvelteKit]() app
- an example of making SvelteKit and [TailwindCSS]() work together
- an example of configuring and using [urql]() as a GraphQL client for standard queries (using standard HTTP/S) and subscriptions (using web sockets transport)
- an example of using [d3]() to display interactive, custom data charts
- a showcase for an animated price-ticker component, with rolling/flashing digits

> DISCLAIMER: this project is meant for testing and educational purposes ONLY.

## Getting started

> Please make sure you have installed and started the accompanying [yahoo-finance-graphql]() project _before_ starting this one!

Clone this project locally, cd into the cloned project, then run:

```bash
npm install

npm run dev
```

By default, the project should then be available at [http://localhost:3000](http://localhost:3000).

If the app is displayed on a dark background, U.S. Markets are closed, if displayed on a light background, U.S. Markets are open (9:30 AM to 4:00 PM weekdays only, excluding national/bank holidays).

## Searching for and displaying an asset/quote

With the app running, start typing the name of a company or stock symbol in the search bar (for example `MSFT` for Microsoft or `AAPL` for Apple). You should instantly receive suggestions.

> You can further restrict the results by choosing a specific asset type using the dropdown control immediately to the right of the search bar.

Once you are satisfied with the suggestions, click on one of them, or alternatively navigate the suggestions using your arrow keys and select one entry with the <kbd>Enter</kbd> key.

This will navigate to the corresponding asset page and display the following:

- the symbol and full name of the asset
- the asset type and market on the right
- the current/latest price of the asset in the currency used for this market/asset ; during open hours and if the asset is popular, you should immediately witness the price move up & down
- a daily candle chart of the recent price history for this asset
- a set of five clickable, related assets and their current/latest price

> Because of some mechanics used by the accompanying GraphQL API, initially loading the first asset page can sometime time out. If this happens, simply reload the page, and be patient!
