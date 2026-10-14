"use client";

import styled from "styled-components";

export const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 380px;
	gap: 28px;
	align-items: start;

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
		gap: 20px;
	}
`;

export const Form = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;

	.row2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	@media (max-width: 560px) {
		.row2 {
			grid-template-columns: 1fr;
		}
	}

	label {
		display: block;
		font-size: 14px;
		font-weight: 650;
		color: var(--mm-ink-2);
		margin-bottom: 7px;
	}
	input,
	select,
	textarea {
		width: 100%;
		border: 1px solid var(--mm-line-2);
		border-radius: var(--mm-r-sm);
		background: var(--mm-surface);
		color: var(--mm-ink);
		font-family: var(--mm-font-sans);
		font-size: 16px;
		padding: 0 13px;
		height: 50px;
	}
	textarea {
		height: auto;
		min-height: 96px;
		padding: 12px 13px;
		line-height: 1.5;
		resize: vertical;
	}
	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--mm-gold-500);
		box-shadow: 0 0 0 3px var(--mm-gold-50);
	}
`;

export const Preview = styled.aside`
	border-radius: var(--mm-r-lg);
	border: 1px solid var(--mm-line);
	overflow: hidden;
	background: var(--mm-wa-bg);
	display: flex;
	flex-direction: column;
	position: sticky;
	top: calc(var(--mm-header-h) + 16px);

	.wptop {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 14px;
		background: var(--mm-wa);
		color: #fff;
	}
	.wav {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.25);
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 13px;
	}
	.wptop b {
		font-size: 14px;
		line-height: 1.1;
	}
	.wptop span {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.85);
	}
	.wplabel {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--mm-ink-3);
		padding: 12px 14px 0;
	}
	.wpbody {
		padding: 10px 14px 16px;
	}
	.bubble {
		background: var(--mm-surface);
		border-radius: 12px 12px 12px 4px;
		padding: 12px 14px;
		font-size: 13px;
		line-height: 1.6;
		color: var(--mm-ink-2);
		box-shadow: var(--mm-shadow);
		white-space: pre-wrap;
		word-break: break-word;
	}
	.wpfoot {
		padding: 14px;
		border-top: 1px solid var(--mm-line);
		margin-top: auto;
	}
	.hint {
		font-size: 13px;
		color: var(--mm-ink-3);
		margin: 0;
	}
`;
