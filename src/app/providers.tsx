"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import '@solana/wallet-adapter-react-ui/styles.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC, ReactNode } from "react";

const queryClient = new QueryClient();

export const Providers: FC<{ endpoint: string | undefined, children: ReactNode }> = ({ endpoint, children }) => {
	if (!endpoint) {
		throw new Error("please add RPC_ENDPOINT to .env");
	}

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={[]} autoConnect>
				<WalletModalProvider>
					<QueryClientProvider client={queryClient}>
						{children}
					</QueryClientProvider>
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}
