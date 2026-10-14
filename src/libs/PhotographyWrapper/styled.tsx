"use client";

import styled, { css } from "styled-components";

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

export const Tabs = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	padding: 20px var(--mm-space-10);
	border-bottom: 1px solid var(--mm-line);

	@media (max-width: 640px) {
		flex-wrap: nowrap;
		overflow-x: auto;
		padding: 14px var(--mm-space-4);
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}
`;

export const Tab = styled.button<{ $on?: boolean }>`
	display: inline-flex;
	align-items: center;
	min-height: 40px;
	padding: 8px 16px;
	border-radius: var(--mm-r-pill);
	border: 1px solid var(--mm-line-2);
	font-family: var(--mm-font-sans);
	font-size: 13px;
	font-weight: 650;
	color: var(--mm-ink-2);
	background: var(--mm-surface);
	white-space: nowrap;
	cursor: pointer;
	transition: background 0.18s var(--mm-ease), color 0.18s var(--mm-ease),
		border-color 0.18s var(--mm-ease);

	${({ $on }) =>
		$on &&
		css`
			background: var(--mm-ink);
			color: var(--mm-bg);
			border-color: var(--mm-ink);

			[data-theme="dark"] & {
				background: var(--mm-gold-500);
				color: #1a1510;
				border-color: var(--mm-gold-500);
			}
		`}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const Masonry = styled.div`
	column-count: 4;
	column-gap: 16px;
	padding: 24px var(--mm-space-10);

	@media (max-width: 1100px) {
		column-count: 3;
	}
	@media (max-width: 760px) {
		column-count: 2;
		column-gap: 12px;
		padding: 16px var(--mm-space-4);
	}
`;

export const Shot = styled.button`
	display: block;
	width: 100%;
	break-inside: avoid;
	margin-bottom: 16px;
	padding: 0;
	border: 0;
	border-radius: var(--mm-r-sm);
	overflow: hidden;
	position: relative;
	cursor: pointer;
	background: none;
	text-align: left;

	@media (max-width: 760px) {
		margin-bottom: 12px;
	}

	.cap {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		padding: 12px;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.66));
		opacity: 0;
		transition: opacity 0.25s var(--mm-ease);
	}
	.cap b {
		display: block;
		font-family: var(--mm-font-serif);
		font-size: 15px;
		color: #fff;
		font-weight: 600;
	}
	.cap > span {
		font-size: 10.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.72);
	}

	&:hover .cap,
	&:focus-visible .cap {
		opacity: 1;
	}

	@media (hover: none) {
		.cap {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cap {
			transition: none;
		}
	}
`;
