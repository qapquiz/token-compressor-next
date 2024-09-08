"use client";

import { NavBar } from "@/components/NavBar";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { getCompressedTokenAccountsByOwner, getParsedTokenAccountsByOwner } from "@/lib/solana";

export default function Home() {
	const { connection } = useConnection();
	const { publicKey } = useWallet();
	// const [isAuthenticated, setIsAuthenticated] = useState(false);

	const { data: tokens, error: getTokensError } = useQuery({
		queryKey: ["userTokens", publicKey?.toBase58()],
		queryFn: async () => {
			if (!publicKey) {
				throw new Error("cannot fetch tokens from the chain")
			}

			return (await getParsedTokenAccountsByOwner(connection, publicKey))
				.map(obj => obj.account)
		},
	});

	const { data: cTokens, error: getCTokensError } = useQuery({
		queryKey: ["userCTokens", publicKey?.toBase58()],
		queryFn: async () => {
			if (!publicKey) {
				throw new Error("cannot fetch compressed token from the RPC")
			}

			return (await getCompressedTokenAccountsByOwner(publicKey, connection.rpcEndpoint))
		}
	})

	return (
		<main>
			<NavBar />
			<div>
				{publicKey?.toBase58() ?? ""}
				<h2 className="text-xl">Tokens</h2>
				<p>
					{JSON.stringify(tokens, null, 2)}
				</p>
				<h2 className="text-xl">Compressed Tokens</h2>
				{JSON.stringify(cTokens, null, 2)}
			</div>
		</main>
	);
}
