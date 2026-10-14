"use client";

import styled from "styled-components";
import { adminLight } from "@/libs/adminTheme";

/** Portals into #modal-root (dark), so the panel re-declares the light tokens. */
export const Panel = styled.div`
	${adminLight}
	margin: auto;
	width: 720px;
	max-width: calc(100vw - 32px);
	max-height: calc(100vh - 80px);
	background: var(--mm-surface);
	color: var(--mm-ink);
	border-radius: var(--mm-r-lg);
	box-shadow: var(--mm-shadow-lg);
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

export const Head = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 18px 20px;
	border-bottom: 1px solid var(--mm-line);

	h3 {
		font-family: var(--mm-font-serif);
		font-size: 18px;
		font-weight: 600;
		margin: 0;
		color: var(--mm-ink);
	}
	.trail {
		margin-left: auto;
	}
`;

export const Body = styled.div`
	padding: 18px 20px;
	overflow-y: auto;
`;
