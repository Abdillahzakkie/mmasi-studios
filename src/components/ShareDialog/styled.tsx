"use client";

import styled from "styled-components";
import { Dialog } from "@/components";
import { adminLight } from "@/libs/adminTheme";

/**
 * The share dialog portals into #modal-root, outside the light admin shell, so
 * it would otherwise inherit the dark public theme. Re-declaring the light
 * tokens on the Dialog element itself re-resolves its own background and colour
 * to light and relights every descendant.
 */
export const LightDialog = styled(Dialog)`
	${adminLight}
`;

export const Head = styled.div`
	padding: 20px 22px 0;

	h3 {
		font-family: var(--mm-font-serif);
		font-size: 20px;
		font-weight: 600;
		margin: 0;
		color: var(--mm-ink);
	}
	p {
		font-size: 13px;
		color: var(--mm-ink-3);
		margin: 6px 0 0;
		line-height: 1.5;
	}
`;

export const Body = styled.div`
	padding: 18px 22px;
	display: flex;
	flex-direction: column;
	gap: 12px;

	.copied {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--mm-ok);
		font-size: 12.5px;
		font-weight: 650;
	}
	.copied::before {
		content: "\\2713";
		font-weight: 700;
	}
`;

export const CopyRow = styled.div`
	display: flex;
	border: 1px solid var(--mm-line-2);
	border-radius: var(--mm-r-sm);
	overflow: hidden;

	input {
		flex: 1;
		min-width: 0;
		border: 0;
		padding: 0 13px;
		height: 44px;
		font-family: var(--mm-font-mono);
		font-size: 13px;
		color: var(--mm-ink-2);
		background: var(--mm-surface-2);
	}
	input:focus {
		outline: none;
	}
	button {
		flex: none;
		border: 0;
		border-left: 1px solid var(--mm-line-2);
		background: var(--mm-surface);
		padding: 0 16px;
		font-weight: 650;
		font-size: 13px;
		color: var(--mm-ink);
		cursor: pointer;
		font-family: var(--mm-font-sans);
	}
`;

export const Foot = styled.div`
	padding: 16px 22px;
	border-top: 1px solid var(--mm-line);
	display: flex;
	justify-content: flex-end;
`;
