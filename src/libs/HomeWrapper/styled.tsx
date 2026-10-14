"use client";

import Link from "next/link";
import styled, { css } from "styled-components";
import Plate from "@/components/Plate";

/** A plate that fills its positioned parent — hero, tile and showreel backdrops. */
export const FillPlate = styled(Plate)`
	position: absolute;
	inset: 0;
`;

/* ---------- Hero ---------------------------------------------------------- */

export const Hero = styled.section`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	min-height: 620px;
	overflow: hidden;
	color: #fff;

	@media (max-width: 640px) {
		min-height: 460px;
	}
`;

export const HeroBody = styled.div`
	position: relative;
	z-index: 2;
	max-width: 860px;
	padding-bottom: 56px;

	@media (max-width: 640px) {
		padding-bottom: 40px;
	}

	h1 {
		font-size: 64px;
		line-height: 1.02;
		letter-spacing: -0.02em;
		text-wrap: balance;
		margin: 0;
	}
	@media (max-width: 640px) {
		h1 {
			font-size: 40px;
		}
	}

	p {
		font-size: 18px;
		color: rgba(255, 255, 255, 0.82);
		max-width: 46ch;
		margin: 18px 0 26px;
		line-height: 1.5;
	}
	@media (max-width: 640px) {
		p {
			font-size: 15px;
		}
	}
`;

export const HeroCta = styled.div`
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
`;

export const ScrollCue = styled.span`
	position: absolute;
	left: 50%;
	bottom: 18px;
	transform: translateX(-50%);
	z-index: 2;
	font-size: 11px;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: rgba(255, 255, 255, 0.6);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;

	&::after {
		content: "";
		width: 1px;
		height: 26px;
		background: rgba(255, 255, 255, 0.4);
	}

	@media (max-width: 640px) {
		display: none;
	}
`;

/* ---------- Highlights grid, asymmetrical by design ----------------------- */

export const HlGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-auto-rows: 150px;
	gap: 16px;

	@media (max-width: 640px) {
		grid-template-columns: repeat(2, 1fr);
		grid-auto-rows: 118px;
	}
`;

const sizes = {
	big: css`
		grid-column: span 4;
		grid-row: span 2;
		@media (max-width: 640px) {
			grid-column: span 2;
		}
	`,
	tall: css`
		grid-column: span 2;
		grid-row: span 2;
	`,
	sq: css`
		grid-column: span 2;
	`,
};

export const HlTile = styled(Link)<{ $size: "big" | "tall" | "sq" }>`
	position: relative;
	border-radius: var(--mm-r);
	overflow: hidden;
	display: block;
	${({ $size }) => sizes[$size]}

	&:hover .zoomcue {
		opacity: 1;
	}
`;

export const TileMeta = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 2;
	padding: 16px;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));

	b {
		display: block;
		font-family: var(--mm-font-serif);
		font-size: 18px;
		color: #fff;
		font-weight: 600;
	}
	span {
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.72);
	}
`;

export const Zoomcue = styled.span`
	position: absolute;
	top: 12px;
	right: 12px;
	z-index: 2;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	border: 1px solid rgba(255, 255, 255, 0.5);
	color: #fff;
	font-size: 13px;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.85;
	transition: opacity 0.2s var(--mm-ease);
`;

/* ---------- Showreel ------------------------------------------------------ */

export const Showreel = styled(Link)`
	position: relative;
	border-radius: var(--mm-r-lg);
	overflow: hidden;
	min-height: 420px;
	display: flex;
	align-items: center;
	justify-content: center;

	@media (max-width: 640px) {
		min-height: 230px;
	}
`;

export const ShowreelPlay = styled.span`
	position: relative;
	z-index: 2;
	width: 84px;
	height: 84px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.14);
	border: 1.5px solid rgba(255, 255, 255, 0.75);
	display: flex;
	align-items: center;
	justify-content: center;

	&::after {
		content: "";
		border-left: 22px solid #fff;
		border-top: 13px solid transparent;
		border-bottom: 13px solid transparent;
		margin-left: 5px;
	}
`;

export const ShowreelMeta = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 2;
	padding: 22px 24px;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
	display: flex;
	align-items: flex-end;
	gap: 14px;

	b {
		font-family: var(--mm-font-serif);
		font-size: 24px;
		color: #fff;
		font-weight: 600;
	}
	span {
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.76);
	}
	.runtime {
		margin-left: auto;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: rgba(255, 255, 255, 0.85);
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: var(--mm-r-pill);
		padding: 3px 11px;
		white-space: nowrap;
	}
`;

/* ---------- Artist statement band ----------------------------------------- */

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
	margin: 16px 0 18px;
	max-width: 58ch;
`;

/* ---------- WhatsApp callout ---------------------------------------------- */

export const WaCallout = styled.div`
	border-radius: var(--mm-r-lg);
	padding: 36px;
	display: flex;
	align-items: center;
	gap: 24px;
	background: var(--mm-surface-2);
	border: 1px solid var(--mm-line);

	@media (max-width: 640px) {
		flex-direction: column;
		align-items: flex-start;
		padding: 24px;
	}

	.wtext {
		flex: 1;
		min-width: 0;
	}
	h3 {
		font-size: 28px;
		font-weight: 600;
		margin: 0 0 6px;
	}
	@media (max-width: 640px) {
		h3 {
			font-size: 22px;
		}
	}
	p {
		color: var(--mm-ink-3);
		font-size: 14px;
		margin: 0;
		max-width: 52ch;
	}
`;
