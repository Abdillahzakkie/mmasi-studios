"use client";

import styled from "styled-components";
import Plate from "@/components/Plate";

/** The editorial page banner. */
export const Banner = styled.header`
	padding: 60px 0 36px;
	border-bottom: 1px solid var(--mm-line);

	@media (max-width: 640px) {
		padding: 36px 0 24px;
	}

	h1 {
		font-size: 52px;
		line-height: 1.03;
		margin: 0;
	}
	@media (max-width: 640px) {
		h1 {
			font-size: 34px;
		}
	}
`;

export const ArtistBand = styled.div`
	display: grid;
	grid-template-columns: 260px 1fr;
	gap: 36px;
	align-items: center;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
		gap: 20px;
	}
`;

export const Portrait = styled(Plate)`
	border-radius: var(--mm-r);
	width: 100%;
	max-width: 260px;

	@media (max-width: 640px) {
		max-width: 220px;
	}
`;

export const Pullquote = styled.p`
	font-family: var(--mm-font-serif);
	font-size: 30px;
	line-height: 1.28;
	letter-spacing: -0.01em;
	font-weight: 500;
	text-wrap: balance;
	margin: 0;

	@media (max-width: 640px) {
		font-size: 22px;
	}

	.by {
		display: block;
		font-family: var(--mm-font-sans);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--mm-gold-600);
		margin-top: 18px;
	}
`;

export const ArtistBio = styled.p`
	color: var(--mm-ink-2);
	font-size: 15px;
	line-height: 1.6;
	margin: 16px 0 0;
	max-width: 58ch;
`;

/* ---------- Production kit ------------------------------------------------ */

export const KitGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 18px;

	@media (max-width: 900px) {
		grid-template-columns: repeat(2, 1fr);
	}
	@media (max-width: 640px) {
		grid-template-columns: 1fr;
		gap: 14px;
	}
`;

export const KitCard = styled.article`
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r);
	padding: 20px;
	background: var(--mm-surface);

	h4 {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--mm-gold-600);
		margin: 0 0 12px;
	}
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	li {
		font-size: 14px;
		color: var(--mm-ink-2);
		display: flex;
		justify-content: space-between;
		gap: 10px;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--mm-line);
	}
	li:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}
	li span {
		color: var(--mm-ink-4);
		font-size: 12px;
	}
`;
