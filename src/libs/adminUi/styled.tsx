"use client";

import styled, { css } from "styled-components";

/** The pane header: a serif title + subtitle on the left, actions on the right. */
export const PaneHead = styled.header`
	display: flex;
	align-items: flex-start;
	gap: 16px;
	margin-bottom: 20px;

	h1 {
		font-family: var(--mm-font-serif);
		font-size: 26px;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--mm-ink);
	}
	p {
		margin: 4px 0 0;
		font-size: 13px;
		color: var(--mm-ink-3);
	}
	.actions {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 10px;
		flex: none;
	}

	@media (max-width: 640px) {
		flex-wrap: wrap;
		.actions {
			margin-left: 0;
		}
	}
`;

export const FilterBar = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 16px;
	flex-wrap: wrap;

	input,
	select {
		height: 44px;
		border: 1px solid var(--mm-line-2);
		border-radius: var(--mm-r-sm);
		background: var(--mm-surface);
		color: var(--mm-ink);
		font-family: var(--mm-font-sans);
		font-size: 14px;
		padding: 0 12px;
	}
	input {
		min-width: 260px;
		flex: 1;
	}
	input::placeholder {
		color: var(--mm-ink-3);
	}
	input:focus,
	select:focus {
		outline: none;
		border-color: var(--mm-gold-500);
		box-shadow: 0 0 0 3px var(--mm-gold-50);
	}
`;

export const TableCard = styled.div`
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r);
	background: var(--mm-surface);
	overflow: hidden;

	table {
		width: 100%;
		border-collapse: collapse;
	}
	th {
		text-align: left;
		font-size: 11px;
		font-weight: 650;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--mm-ink-3);
		background: var(--mm-surface-2);
		padding: 0 14px;
		height: 42px;
		border-bottom: 1px solid var(--mm-line);
		white-space: nowrap;
	}
	td {
		padding: 12px 14px;
		border-bottom: 1px solid var(--mm-line);
		vertical-align: middle;
		font-size: 14px;
		color: var(--mm-ink);
	}
	th:last-child,
	td:last-child {
		text-align: right;
	}
	tbody tr:last-child td {
		border-bottom: 0;
	}
	tbody tr:hover {
		background: var(--mm-gold-50);
	}
	.sub {
		display: block;
		font-size: 12px;
		color: var(--mm-ink-3);
		line-height: 1.35;
		margin-top: 2px;
	}
	.title {
		font-weight: 600;
		color: var(--mm-ink);
	}
	.cell-main {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.row-actions {
		display: inline-flex;
		gap: 8px;
		justify-content: flex-end;
	}
`;

export const Thumb = styled.div`
	width: 46px;
	height: 46px;
	border-radius: var(--mm-r-sm);
	overflow: hidden;
	flex: none;
`;

const toneColor = {
	ok: css`
		color: var(--mm-ok);
		background: var(--mm-ok-bg);
	`,
	warn: css`
		color: var(--mm-warn);
		background: var(--mm-warn-bg);
	`,
	info: css`
		color: var(--mm-info);
		background: var(--mm-info-bg);
	`,
	idle: css`
		color: var(--mm-ink-3);
		background: var(--mm-surface-2);
	`,
};

export type PillTone = keyof typeof toneColor;

/** Status as a word AND a colour, never a colour alone. */
export const Pill = styled.span<{ $tone: PillTone }>`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 3px 11px;
	border-radius: var(--mm-r-pill);
	font-size: 13px;
	font-weight: 650;
	white-space: nowrap;
	${({ $tone }) => toneColor[$tone]}

	&::before {
		content: "";
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
		flex: none;
	}
`;

export const Chip = styled.span`
	display: inline-flex;
	align-items: center;
	padding: 4px 11px;
	border-radius: var(--mm-r-pill);
	background: var(--mm-surface-2);
	color: var(--mm-ink-2);
	font-size: 13px;
	font-weight: 600;
	white-space: nowrap;
`;

export const Badge = styled.span`
	display: inline-flex;
	align-items: center;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.05em;
	border-radius: var(--mm-r-sm);
	padding: 3px 8px;
	background: var(--mm-surface-2);
	color: var(--mm-ink-2);
	white-space: nowrap;
`;

export const EmptyBox = styled.div`
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r);
	background: var(--mm-surface);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 64px 24px;
	text-align: center;

	.eglyph {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		background: var(--mm-surface-2);
		border: 1px solid var(--mm-line);
	}
	h2 {
		font-family: var(--mm-font-serif);
		font-size: 18px;
		font-weight: 600;
		color: var(--mm-ink-2);
	}
	p {
		margin: 0;
		font-size: 14px;
		color: var(--mm-ink-3);
		max-width: 42ch;
		line-height: 1.5;
	}
	.ebtn {
		margin-top: 8px;
	}
`;

export const Split = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
	gap: 18px;
	align-items: start;

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
	}
`;

export const Card = styled.div`
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r);
	background: var(--mm-surface);
	padding: 20px;

	h2 {
		font-family: var(--mm-font-serif);
		font-size: 15px;
		font-weight: 700;
		margin: 0 0 14px;
		color: var(--mm-ink);
	}
`;

export const FormGrid = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;

	.row2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	label {
		display: block;
		font-size: 13px;
		font-weight: 650;
		color: var(--mm-ink-2);
		margin-bottom: 6px;
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
		font-size: 15px;
		padding: 0 12px;
		height: 44px;
	}
	textarea {
		height: auto;
		min-height: 88px;
		padding: 10px 12px;
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

	@media (max-width: 560px) {
		.row2 {
			grid-template-columns: 1fr;
		}
	}
`;

export const PreviewFrame = styled.div`
	border-radius: var(--mm-r-sm);
	overflow: hidden;
	margin-bottom: 12px;
`;

export const PreviewMeta = styled.div`
	.pv-tag {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mm-gold-600);
	}
	.pv-title {
		font-family: var(--mm-font-serif);
		font-size: 20px;
		font-weight: 600;
		margin: 4px 0;
		color: var(--mm-ink);
	}
	.pv-sub {
		font-size: 13px;
		color: var(--mm-ink-3);
	}
`;

/** A segmented control; each child is a <button type="button" data-on>. */
export const Seg = styled.div`
	display: inline-flex;
	background: var(--mm-surface-2);
	border-radius: var(--mm-r-sm);
	padding: 3px;
	gap: 3px;
	flex-wrap: wrap;

	button {
		border: 0;
		background: transparent;
		padding: 7px 14px;
		font-size: 13px;
		font-weight: 650;
		color: var(--mm-ink-3);
		border-radius: 4px;
		cursor: pointer;
		font-family: var(--mm-font-sans);
	}
	button[data-on="true"] {
		background: var(--mm-surface);
		color: var(--mm-ink);
		box-shadow: var(--mm-shadow);
	}
`;

export const ToggleRow = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;

	.tlabel {
		font-size: 14px;
		font-weight: 600;
		color: var(--mm-ink-2);
	}
	button {
		margin-left: auto;
		width: 46px;
		height: 26px;
		border-radius: var(--mm-r-pill);
		border: 0;
		background: var(--mm-line-2);
		position: relative;
		cursor: pointer;
		flex: none;
	}
	button::after {
		content: "";
		position: absolute;
		top: 3px;
		left: 3px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		transition: left 0.15s var(--mm-ease);
	}
	button[data-on="true"] {
		background: var(--mm-gold-500);
	}
	button[data-on="true"]::after {
		left: 23px;
	}
`;

export const Muted = styled.p`
	margin: 0;
	font-size: 14px;
	color: var(--mm-ink-3);
	font-style: italic;
`;

export const DefList = styled.dl`
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 14px;

	dt {
		font-size: 12px;
		font-weight: 650;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--mm-ink-3);
		margin-bottom: 4px;
	}
	dd {
		margin: 0;
		font-size: 15px;
		color: var(--mm-ink);
		line-height: 1.5;
	}
	a {
		color: var(--mm-wa-600);
		font-weight: 600;
	}
`;

export const Stack = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
`;

export const CheckRow = styled.label`
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 14px;
	font-weight: 600;
	color: var(--mm-ink-2);
	cursor: pointer;

	input {
		width: 18px;
		height: 18px;
		accent-color: var(--mm-gold-500);
	}
`;

/** A horizontal cluster of fields for one row of a repeatable list. */
export const RepeatRow = styled.div`
	display: flex;
	gap: 10px;
	align-items: flex-end;
	flex-wrap: wrap;
	padding: 12px;
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r-sm);
	background: var(--mm-surface-2);

	> div {
		flex: 1;
		min-width: 120px;
	}
	label {
		display: block;
		font-size: 12px;
		font-weight: 650;
		color: var(--mm-ink-2);
		margin-bottom: 6px;
	}
	input,
	select {
		width: 100%;
		height: 40px;
		border: 1px solid var(--mm-line-2);
		border-radius: var(--mm-r-sm);
		background: var(--mm-surface);
		color: var(--mm-ink);
		font-family: var(--mm-font-sans);
		font-size: 14px;
		padding: 0 10px;
	}
`;

export const MediaGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
	gap: 12px;
`;

export const MediaTile = styled.button`
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r);
	background: var(--mm-surface);
	padding: 0;
	overflow: hidden;
	cursor: pointer;
	text-align: left;
	display: flex;
	flex-direction: column;

	img,
	video {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		background: var(--mm-surface-2);
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
	&:hover {
		border-color: var(--mm-gold-500);
	}
`;
