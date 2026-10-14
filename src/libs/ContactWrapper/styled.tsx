"use client";

import styled from "styled-components";

export const Banner = styled.div`
	padding: var(--mm-space-16) 0 var(--mm-space-8);

	@media (max-width: 640px) {
		padding: var(--mm-space-10) 0 var(--mm-space-6);
	}

	h1 {
		font-size: clamp(34px, 5vw, 52px);
		line-height: 1.03;
		margin-top: var(--mm-space-3);
	}
	p {
		color: var(--mm-ink-3);
		font-size: 15px;
		max-width: 62ch;
		margin: var(--mm-space-3) 0 0;
		line-height: 1.55;
	}
`;

export const Coords = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
	margin-top: var(--mm-space-10);

	@media (max-width: 900px) {
		grid-template-columns: repeat(2, 1fr);
	}
	@media (max-width: 560px) {
		grid-template-columns: 1fr;
	}

	.coord {
		border: 1px solid var(--mm-line);
		border-radius: var(--mm-r);
		padding: 18px 20px;
		background: var(--mm-surface);
	}
	.k {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--mm-ink-3);
	}
	.v {
		font-size: 17px;
		font-weight: 600;
		margin-top: 5px;
	}
	.v.wa {
		color: var(--mm-wa-600);
	}
`;

export const Socials = styled.div`
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
	margin-top: var(--mm-space-5);

	a {
		display: inline-flex;
		align-items: center;
		padding: 8px 14px;
		border-radius: var(--mm-r-pill);
		border: 1px solid var(--mm-line-2);
		font-size: 13px;
		font-weight: 650;
		color: var(--mm-ink-2);
	}
`;
