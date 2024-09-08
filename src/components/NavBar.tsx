"use client";

import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
	async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
	{ ssr: false }
);

export function NavBar() {
	return (
		<menu className="min-h-12 flex items-top justify-between">
			<h1 className="text-2xl font-mono">Compressor</h1>
			<WalletMultiButtonDynamic />
		</menu>
	);
}
