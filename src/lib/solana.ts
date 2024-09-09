import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { Connection, PublicKey } from "@solana/web3.js";
import env from "./env";

export type CompressedTokenAccountsByOwnerResponse = {
	result: {
		value: {
			items: Array<{
				tokenData: {
					amount: number;
					mint: string;
					owner: string;
				};
			}>;
		};
	};
}

export type Tokens = {
	mint: string;
	decimals: number;
	amount: number;
	owner: string;
	isCompressed: boolean;
};

export async function getTokens(connection: Connection, wallet: PublicKey): Promise<Tokens[]> {
	// @todo add support for token2022 program (compressed token not support token2022 yet.)
	const [tokens] = await Promise.all([
		connection.getParsedTokenAccountsByOwner(wallet, { programId: TOKEN_PROGRAM_ID }),
		// connection.getParsedTokenAccountsByOwner(wallet, { programId: TOKEN_2022_PROGRAM_ID }),
	]);


	const transformedTokens = tokens.value.map((token) => {
		return {
			mint: token.account.data.parsed.info.mint,
			decimals: token.account.data.parsed.info.tokenAmount.decimals,
			amount: token.account.data.parsed.info.tokenAmount.amount,
			owner: token.account.data.parsed.info.owner,
			isCompressed: false,
		};
	});

	const tokensWithMetadata = await getTokenMetadata(transformedTokens);
	return tokensWithMetadata;
}

export async function getCompressedTokens(
	wallet: PublicKey,
	endpoint: string | undefined = env.RPC_ENDPOINT
): Promise<Tokens[]> {
	if (!endpoint) {
		throw new Error("RPC endpoint not provided. You have to send directly or set the RPC_ENDPOINT environment variable.");
	}

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"jsonrpc": "2.0",
			"id": "test-account",
			"method": "getCompressedTokenAccountsByOwner",
			"params": {
				"owner": wallet.toBase58()
			}
		}),
	});

	const cTokensResponse = await response.json() as CompressedTokenAccountsByOwnerResponse;

	// @todo how to find the decimal of the compressed token?
	const trasformedCTokens = cTokensResponse.result.value.items.map((cToken) => {
		return {
			mint: cToken.tokenData.mint,
			decimals: 9,
			amount: cToken.tokenData.amount,
			owner: cToken.tokenData.owner,
			isCompressed: true,
		};
	});

	const cTokensWithMedata = await getTokenMetadata(trasformedCTokens);
	return cTokensWithMedata;
}

export async function getTokenMetadata(tokens: Tokens[]): Promise<Tokens[]> {
	// @todo get token metadata and uri from jup tokens api
	return tokens;
}
