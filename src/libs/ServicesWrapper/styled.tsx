"use client";

import styled from "styled-components";

/** The editorial page banner above a content index. */
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
	p {
		color: var(--mm-ink-3);
		font-size: 15px;
		max-width: 62ch;
		margin: 14px 0 0;
		line-height: 1.55;
	}
`;

export const ServiceGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20px;

	@media (max-width: 900px) {
		grid-template-columns: repeat(2, 1fr);
	}
	@media (max-width: 640px) {
		grid-template-columns: 1fr;
		gap: 16px;
	}
`;

export const ServiceCard = styled.article<{ $feature?: boolean }>`
	border: 1px solid ${({ $feature }) => ($feature ? "var(--mm-gold-500)" : "var(--mm-line)")};
	border-radius: var(--mm-r-lg);
	background: var(--mm-surface);
	padding: 28px 24px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	${({ $feature }) => $feature && "box-shadow: 0 0 0 1px var(--mm-gold-500);"}

	.stag {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--mm-gold-600);
	}
	h3 {
		font-size: 24px;
		font-weight: 600;
		margin: 0;
		line-height: 1.1;
	}
	.sdesc {
		color: var(--mm-ink-3);
		font-size: 13.5px;
		line-height: 1.5;
		margin: 0;
	}
	.invest {
		font-family: var(--mm-font-serif);
		font-size: 15px;
		color: var(--mm-ink-2);
	}
	.invest b {
		font-size: 26px;
		color: var(--mm-ink);
		letter-spacing: -0.01em;
	}
`;

export const Delivers = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 9px;
	margin: 0;
	padding: 0;
	list-style: none;

	li {
		display: flex;
		gap: 10px;
		font-size: 13.5px;
		color: var(--mm-ink-2);
		line-height: 1.4;
	}
	li::before {
		content: "";
		width: 16px;
		height: 16px;
		border-radius: 50%;
		flex: none;
		margin-top: 2px;
		background: var(--mm-gold-50);
		border: 1px solid var(--mm-gold-300);
		background-image: linear-gradient(var(--mm-gold-600), var(--mm-gold-600));
		background-size: 7px 2px;
		background-repeat: no-repeat;
		background-position: center;
	}
`;

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
