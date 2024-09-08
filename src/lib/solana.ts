import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { Connection, PublicKey } from "@solana/web3.js";

export const RPC_ENDPOINT = process.env.RPC_ENDPOINT;

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

export async function getParsedTokenAccountsByOwner(connection: Connection, wallet: PublicKey) {
	const [tokens, tokens2022] = await Promise.all([
		connection.getParsedTokenAccountsByOwner(wallet, { programId: TOKEN_PROGRAM_ID }),
		connection.getParsedTokenAccountsByOwner(wallet, { programId: TOKEN_2022_PROGRAM_ID }),
	]);

	return [...tokens.value, ...tokens2022.value];
}

export async function getCompressedTokenAccountsByOwner(wallet: PublicKey, endpoint: string | undefined = RPC_ENDPOINT): Promise<CompressedTokenAccountsByOwnerResponse> {
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

	return await response.json() as CompressedTokenAccountsByOwnerResponse;
}
