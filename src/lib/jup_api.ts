import { batch } from "./batch";
import env from "./env";
import type { PublicKey } from "@solana/web3.js";

type JupPriceApiResponse = {
	[name: string]: {
		id: string;
		mintSymbol: string;
		vsToken: string;
		vsTokenSymbol: string;
		price: number;
	};
};

type JupTokensApiResponse = {};

async function priceApi(mintAddresses: PublicKey[], priceApiUrl: string | undefined = env.JUP_PRICE_API_URL): Promise<JupPriceApiResponse> {
	if (!priceApiUrl) {
		throw new Error("JUP_PRICE_API_URL not provided. You have to send directly or set the JUP_PRICE_API_URL environment variable.");
	}

	let prices = {};
	const batches = batch(mintAddresses);
	for (const batch of batches) {
		const searchParams = new URLSearchParams();
		const mintAddresses = batch.map(tokenPublicKey => tokenPublicKey.toBase58()).join(",");
		searchParams.append("ids", mintAddresses);

		const apiURL = new URL(priceApiUrl);
		apiURL.search = searchParams.toString();

		const response = await fetch(apiURL);
		const priceBatch = (await response.json()).data;
		prices = { ...prices, ...priceBatch };
	}

	return prices;
}

async function tokensApi(tokensApiUrl = env.JUP_TOKENS_API_URL): Promise<JupTokensApiResponse> {
	if (!tokensApiUrl) {
		throw new Error("JUP_TOKENS_API_URL not provided. You have to send directly or set the JUP_TOKENS_API_URL environment variable.");
	}

	const response = await fetch(tokensApiUrl);
	return (await response.json()) as JupTokensApiResponse;
}

export default {
	priceApi,
	tokensApi,
}
