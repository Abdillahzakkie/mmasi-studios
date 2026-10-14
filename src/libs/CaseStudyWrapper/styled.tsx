"use client";

import styled from "styled-components";

export const Cover = styled.section`
	position: relative;
	height: 480px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	color: #fff;
	overflow: hidden;

	@media (max-width: 640px) {
		height: 340px;
	}

	.plate-bg {
		position: absolute;
		inset: 0;
	}
	.cbody {
		position: relative;
		z-index: 2;
		padding: 0 var(--mm-space-6) var(--mm-space-10);
		max-width: 820px;
	}
	.ctag {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--mm-gold-300);
		margin-bottom: 12px;
	}
	h1 {
		font-size: clamp(32px, 6vw, 56px);
		line-height: 1.04;
		color: #fff;
	}
`;

export const Ribbon = styled.div`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	border-top: 1px solid var(--mm-line);
	border-bottom: 1px solid var(--mm-line);

	@media (max-width: 760px) {
		grid-template-columns: repeat(2, 1fr);
	}

	.sr {
		padding: 18px var(--mm-space-6);
		border-left: 1px solid var(--mm-line);
	}
	.sr:first-child {
		border-left: 0;
	}
	.k {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--mm-ink-4);
	}
	.v {
		font-size: 15px;
		font-weight: 600;
		margin-top: 5px;
	}
`;

export const Body = styled.div`
	padding: var(--mm-space-13) var(--mm-space-6);
	max-width: 760px;
	margin: 0 auto;

	@media (max-width: 640px) {
		padding: var(--mm-space-8) var(--mm-space-4);
	}

	h3 {
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--mm-gold-600);
		margin: 0 0 12px;
	}
	p {
		font-size: 16px;
		line-height: 1.75;
		color: var(--mm-ink-2);
		margin: 0 0 var(--mm-space-6);
	}
`;

export const Stack = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-width: var(--mm-content-max);
	margin: 0 auto;
	padding: 0 var(--mm-space-6) var(--mm-space-13);

	@media (max-width: 640px) {
		padding: 0 var(--mm-space-4) var(--mm-space-8);
	}
`;

export const Collaborate = styled.div`
	border-radius: var(--mm-r-lg);
	padding: 36px;
	display: flex;
	align-items: center;
	gap: 24px;
	background: var(--mm-surface-2);
	border: 1px solid var(--mm-line);
	max-width: var(--mm-content-max);
	margin: 0 auto var(--mm-space-13);

	@media (max-width: 640px) {
		flex-direction: column;
		align-items: flex-start;
		padding: 24px;
		margin: 0 var(--mm-space-4) var(--mm-space-8);
	}

	.ctext {
		flex: 1;
		min-width: 0;
	}
	h3 {
		font-family: var(--mm-font-serif);
		font-size: 28px;
		font-weight: 600;
		margin: 0 0 6px;
	}
	p {
		color: var(--mm-ink-3);
		font-size: 14px;
		margin: 0;
		max-width: 52ch;
	}
`;
