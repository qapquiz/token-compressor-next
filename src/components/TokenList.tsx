"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import type { Token } from "@/lib/solana";

export function TokenList({ tokens }: { tokens: Token[] }) {
	// The scrollable element
	const parentRef = useRef<HTMLDivElement | null>(null);

	const rowVirtualizer = useVirtualizer({
		count: tokens.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 48,
	});
	return (
		<div ref={parentRef} className="h-[96px] overflow-auto">
			<div
				className={`h-[${rowVirtualizer.getTotalSize()}px] w-full relative`}
			>
				{rowVirtualizer.getVirtualItems().map((virtualItem) => (
					<div
						key={virtualItem.key}
						className={`absolute top-0 left-0 w-full min-h-[${virtualItem.size}] translate-y-[${virtualItem.start}]`}
					>
						Row: {virtualItem.index} {tokens[virtualItem.index].mint} {tokens[virtualItem.index].amount}
						{
							tokens[virtualItem.index].isCompressed ?
								<button className="btn btn-warning">
									Decompress
								</button> :
								<button className="btn btn-accent">
									Compress
								</button>
						}
					</div>
				))}
			</div>
		</div>
	);
}
