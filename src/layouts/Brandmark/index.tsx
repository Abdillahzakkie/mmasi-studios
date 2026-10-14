"use client";

import Link from "next/link";
import styled from "styled-components";
import { STUDIO } from "@/constants/studio";

const Wrap = styled(Link)`
	display: flex;
	align-items: center;
	gap: 11px;
	font-family: var(--mm-font-serif);
	font-weight: 700;
	font-size: 19px;
	letter-spacing: 0.01em;
	white-space: nowrap;
	color: inherit;

	.mono-m {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		flex: none;
		border: 1.5px solid var(--mm-gold-500);
		color: var(--mm-gold-600);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 17px;
		font-weight: 700;
	}
	small {
		display: block;
		font-family: var(--mm-font-sans);
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--mm-ink-3);
	}
`;

/** The studio monogram + wordmark, linking home. */
export default function Brandmark() {
	return (
		<Wrap href="/" aria-label={`${STUDIO.name} home`}>
			<span className="mono-m" aria-hidden>
				M
			</span>
			<span>
				MmasiEjikeme
				<small>Studios</small>
			</span>
		</Wrap>
	);
}
