"use client";
import styled from "styled-components";

/** The friendly permission grid: one Off / View / Manage choice per thing owned. */
export const PermList = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 8px;
	@media (max-width: 860px) {
		grid-template-columns: 1fr;
	}
`;

export const PermRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14px;
	padding: 9px 12px;
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r-sm);
	background: var(--mm-surface);

	.pname {
		font-size: 14px;
		font-weight: 650;
		color: var(--mm-ink);
	}
	.pdesc {
		font-size: 12px;
		color: var(--mm-ink-3);
		margin-top: 1px;
	}
`;

/** Three-way level control; only the selected level carries its colour. */
export const LevelSeg = styled.div`
	display: inline-flex;
	background: var(--mm-surface-2);
	border-radius: var(--mm-r-sm);
	padding: 3px;
	gap: 3px;
	flex: none;

	button {
		padding: 6px 13px;
		font-size: 13px;
		font-weight: 650;
		color: var(--mm-ink-3);
		border: none;
		background: transparent;
		border-radius: calc(var(--mm-r-sm) - 1px);
		cursor: pointer;
		transition: background 0.12s ease;
	}
	button:hover {
		color: var(--mm-ink);
	}
	button[data-on="off"] {
		background: var(--mm-surface);
		color: var(--mm-ink);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	}
	button[data-on="read"] {
		background: var(--mm-gold-50);
		color: var(--mm-gold-700);
	}
	button[data-on="full"] {
		background: var(--mm-gold-500);
		color: #1a1510;
	}
`;

export const ListRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 10px 12px;
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r-sm);

	& + & {
		margin-top: 8px;
	}
	.who {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.lav {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--mm-surface-2);
		border: 1px solid var(--mm-line);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: 700;
		color: var(--mm-ink-2);
		flex: none;
	}
	.meta b {
		font-size: 14px;
		font-weight: 650;
		color: var(--mm-ink);
		display: block;
	}
	.meta span {
		font-size: 12px;
		color: var(--mm-ink-3);
	}
`;

export const CardHead = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;
	flex-wrap: wrap;
	margin-bottom: 12px;

	.ch-title {
		font-size: 15px;
		font-weight: 700;
		color: var(--mm-ink);
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.ch-sub {
		font-size: 12px;
		color: var(--mm-ink-3);
		margin-top: 3px;
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}
	.ch-acts {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
`;

export const Advanced = styled.details`
	margin-top: 14px;

	summary {
		cursor: pointer;
		font-size: 13px;
		color: var(--mm-ink-3);
	}
	textarea {
		width: 100%;
		margin-top: 8px;
		min-height: 150px;
		padding: 10px 12px;
		border: 1px solid var(--mm-line);
		border-radius: var(--mm-r-sm);
		background: var(--mm-surface-2);
		color: var(--mm-ink-2);
		font-family: ui-monospace, "SF Mono", monospace;
		font-size: 12px;
		resize: vertical;
	}
	.err {
		color: var(--mm-danger);
		font-size: 12px;
		margin-top: 6px;
	}
`;

export const TabBar = styled.div`
	margin-bottom: 18px;
`;
