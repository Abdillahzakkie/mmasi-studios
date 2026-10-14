"use client";

import styled from "styled-components";

export const Banner = styled.div`
	padding: 60px var(--mm-space-10) 36px;
	border-bottom: 1px solid var(--mm-line);

	h1 {
		font-family: var(--mm-font-serif);
		font-weight: 600;
		font-size: clamp(34px, 5vw, 52px);
		letter-spacing: -0.02em;
		margin: 0;
		line-height: 1.03;
	}
	p {
		color: var(--mm-ink-3);
		font-size: 15px;
		max-width: 62ch;
		margin: 14px 0 0;
		line-height: 1.55;
	}

	@media (max-width: 640px) {
		padding: 36px var(--mm-space-4) 24px;
	}
`;

/** A titled region: the section head and its grid, inset to the page gutter. */
export const Band = styled.section`
	padding: 48px var(--mm-space-10);

	& + & {
		padding-top: 0;
	}

	@media (max-width: 640px) {
		padding: 32px var(--mm-space-4);
	}
`;

export const ReelRow = styled.div`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 16px;

	@media (max-width: 900px) {
		grid-template-columns: repeat(3, 1fr);
	}
	@media (max-width: 640px) {
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}
`;

export const ReelCard = styled.button`
	position: relative;
	display: block;
	width: 100%;
	padding: 0;
	border: 0;
	border-radius: var(--mm-r);
	overflow: hidden;
	cursor: pointer;
	background: none;
	color: inherit;
	text-align: left;
	transition: transform 0.18s var(--mm-ease);

	&:hover {
		transform: translateY(-2px);
	}

	.dur {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 2;
		font-size: 11px;
		font-weight: 700;
		color: #fff;
		background: rgba(0, 0, 0, 0.55);
		border-radius: var(--mm-r-pill);
		padding: 2px 9px;
		letter-spacing: 0.04em;
	}
	.rplay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.16);
		border: 1px solid rgba(255, 255, 255, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.rplay::after {
		content: "";
		border-left: 13px solid #fff;
		border-top: 8px solid transparent;
		border-bottom: 8px solid transparent;
		margin-left: 3px;
	}
	.rmeta {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		padding: 12px;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
	}
	.rmeta b {
		display: block;
		font-family: var(--mm-font-serif);
		font-size: 15px;
		color: #fff;
		font-weight: 600;
		line-height: 1.2;
	}
	.rmeta > span {
		display: block;
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
		margin-top: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const CineRow = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
		gap: 16px;
	}
`;

export const CineCard = styled.button`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 0;
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r);
	overflow: hidden;
	background: var(--mm-surface);
	color: inherit;
	text-align: left;
	cursor: pointer;
	transition: transform 0.18s var(--mm-ease), border-color 0.18s var(--mm-ease);

	&:hover {
		transform: translateY(-2px);
		border-color: var(--mm-line-2);
	}

	> div:first-child {
		border-radius: 0;
	}

	.res {
		position: absolute;
		top: 12px;
		left: 12px;
		z-index: 2;
		font-size: 11px;
		font-weight: 700;
		color: #fff;
		background: rgba(0, 0, 0, 0.55);
		border-radius: var(--mm-r-sm);
		padding: 2px 9px;
		letter-spacing: 0.05em;
	}
	.cplay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		width: 62px;
		height: 62px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.16);
		border: 1.5px solid rgba(255, 255, 255, 0.75);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.cplay::after {
		content: "";
		border-left: 18px solid #fff;
		border-top: 11px solid transparent;
		border-bottom: 11px solid transparent;
		margin-left: 4px;
	}
	.cbody {
		padding: 16px 18px;
	}
	.ctag {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mm-gold-600);
	}
	.cbody h4 {
		font-family: var(--mm-font-serif);
		font-size: 20px;
		font-weight: 600;
		margin: 5px 0 6px;
		line-height: 1.15;
	}
	.cbody p {
		color: var(--mm-ink-3);
		font-size: 13.5px;
		line-height: 1.5;
		margin: 0;
	}
	.cfoot {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
		font-size: 12px;
		color: var(--mm-ink-3);
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;
