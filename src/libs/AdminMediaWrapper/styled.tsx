"use client";

import styled from "styled-components";
import { Dialog } from "@/components";
import { adminLight } from "@/libs/adminTheme";

export const ManageGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	gap: 14px;
`;

/** A management tile: thumbnail + name, an optional rename row, and an actions row. */
export const MediaCard = styled.div`
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r);
	background: var(--mm-surface);
	overflow: hidden;
	display: flex;
	flex-direction: column;

	.thumb {
		border: 0;
		padding: 0;
		margin: 0;
		background: transparent;
		cursor: pointer;
		display: block;
		width: 100%;
	}
	img,
	video {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		background: var(--mm-surface-2);
		display: block;
	}
	.ph {
		width: 100%;
		aspect-ratio: 1 / 1;
		background: var(--mm-surface-2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--mm-ink-4);
	}
	.meta {
		padding: 8px 10px;
		font-size: 11px;
		color: var(--mm-ink-3);
		word-break: break-all;
	}
	.renamerow {
		display: flex;
		gap: 6px;
		padding: 0 10px 8px;
	}
	.renamerow input {
		flex: 1;
		min-width: 0;
		height: 32px;
		border: 1px solid var(--mm-line-2);
		border-radius: var(--mm-r-sm);
		background: var(--mm-surface);
		color: var(--mm-ink);
		font-size: 12px;
		padding: 0 8px;
		font-family: var(--mm-font-sans);
	}
	.renamerow input:focus {
		outline: none;
		border-color: var(--mm-gold-500);
		box-shadow: 0 0 0 3px var(--mm-gold-50);
	}
	.err {
		padding: 0 10px 8px;
		font-size: 11px;
		font-weight: 600;
		color: var(--mm-danger);
	}
	.actions {
		margin-top: auto;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
		padding: 8px 10px 10px;
		border-top: 1px solid var(--mm-line);
	}
	.actions a {
		font-size: 12px;
		font-weight: 650;
		color: var(--mm-ink-2);
		text-decoration: underline;
	}
`;

/** The confirm/usage dialog; portals into #modal-root (dark) so it re-lights. */
export const LightDialog = styled(Dialog)`
	${adminLight}

	.dhead {
		padding: 20px 22px 0;
	}
	.dhead h3 {
		font-family: var(--mm-font-serif);
		font-size: 20px;
		font-weight: 600;
		margin: 0;
		color: var(--mm-ink);
	}
	.dhead p {
		font-size: 13px;
		color: var(--mm-ink-3);
		margin: 6px 0 0;
		word-break: break-all;
	}
	.dbody {
		padding: 16px 22px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.reflist {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.reflist li {
		display: flex;
		gap: 8px;
		align-items: baseline;
		font-size: 13px;
		color: var(--mm-ink-2);
	}
	.reflist .rtype {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--mm-gold-600);
		flex: none;
	}
	.reflist .rfield {
		margin-left: auto;
		font-size: 12px;
		color: var(--mm-ink-3);
		flex: none;
	}
	.dfoot {
		padding: 16px 22px;
		border-top: 1px solid var(--mm-line);
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}
`;
