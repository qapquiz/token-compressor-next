"use client";

import dynamic from "next/dynamic";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

const WalletMultiButtonDynamic = dynamic(
	async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
	{ ssr: false }
);

export default function Home() {
	const { connection } = useConnection();
	const { publicKey, signIn } = useWallet();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	return (
		<main>
			<menu className="flex items-top justify-between">
				<h1 className="text-2xl font-mono">Compressor</h1>
				<WalletMultiButtonDynamic />
			</menu>

			<div>
				{publicKey?.toBase58() ?? ""}
			</div>
		</main>
	);
}
