import { gql } from '@urql/svelte';

export const GET_MARKET_STATUS = gql`
	query MarketStatus {
		marketStatus {
			id
			name
			status
			message
			time
			open
			close
			duration {
				days
				hrs
				mins
			}
		}
	}
`;

export const GET_RECOS = gql`
	query Recommend($symbol: String!) {
		recommend(symbol: $symbol) {
			id
			symbol
		}
	}
`;

export const GET_QUOTES = gql`
	query getQuotes($symbols: [String!]!) {
		quotes(symbols: $symbols) {
			id
			symbol
			shortName
			quoteType
			exchange
			currency
			quoteSourceName
			regularMarketChange
			regularMarketChangePercent
			regularMarketPrice
			regularMarketDayHigh
			regularMarketDayLow
			regularMarketPreviousClose
			regularMarketOpen
			fiftyTwoWeekLow
			fiftyTwoWeekHigh
			priceHint
			regularMarketTime
			marketState
		}
	}
`;

export const GET_PROFILE = gql`
	query Profile($symbol: String!) {
		profile(symbol: $symbol) {
			id
			symbol
			shortName
			quoteType
			exchange
			longName
			exchangeName
			currency
			currencySymbol
		}
	}
`;

export const GET_DATA = gql`
	query Data($symbol: String!, $interval: Interval!) {
		quoteData(symbol: $symbol, interval: $interval) {
			id
			symbol
			quoteType
			exchange
			priceHint
			dataGranularity
			data {
				timestamp
				open
				high
				low
				close
				# volume
				adjClose
			}
		}
	}
`;

export const SUB_TICKER = gql`
	subscription Ticker($symbols: [String!]!) {
		quoteUpdate(symbols: $symbols) {
			id
			symbol
			price
			change
			changePercent
			dayVolume
			time
		}
	}
`;
