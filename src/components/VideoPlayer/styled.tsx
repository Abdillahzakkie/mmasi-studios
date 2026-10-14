"use client";

import styled, { css } from "styled-components";

/**
 * The player fills the scrim below the persistent header. The scrim comes from
 * Modal; this column holds the stage, the controls bar and the metadata footer.
 */
export const Player = styled.div`
	width: 100%;
	margin-top: var(--mm-header-h);
	display: flex;
	flex-direction: column;
	min-height: 0;

	@media (max-width: 900px) {
		margin-top: 60px;
	}
`;

export const Stage = styled.div`
	flex: 1;
	min-height: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 28px;
	position: relative;

	@media (max-width: 640px) {
		padding: 16px;
	}
`;

/** The video surface: 16/9 for cinema, 9/16 for a reel. The Plate fills it. */
export const Frame = styled.div<{ $format: "reel" | "cinema" }>`
	position: relative;
	border-radius: var(--mm-r);
	overflow: hidden;
	max-height: 100%;
	${({ $format }) =>
		$format === "cinema"
			? css`
					width: 100%;
					max-width: 980px;
					aspect-ratio: 16 / 9;
				`
			: css`
					height: 100%;
					aspect-ratio: 9 / 16;
				`}

	> div {
		position: absolute;
		inset: 0;
	}
`;

export const Play = styled.span`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 2;
	width: 84px;
	height: 84px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.14);
	border: 1.5px solid rgba(255, 255, 255, 0.75);
	display: flex;
	align-items: center;
	justify-content: center;

	&::after {
		content: "";
		border-left: 22px solid #fff;
		border-top: 13px solid transparent;
		border-bottom: 13px solid transparent;
		margin-left: 5px;
	}

	@media (max-width: 640px) {
		width: 64px;
		height: 64px;

		&::after {
			border-left: 17px solid #fff;
			border-top: 10px solid transparent;
			border-bottom: 10px solid transparent;
		}
	}
`;

export const Controls = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 12px 24px;
	color: #fff;
	background: rgba(0, 0, 0, 0.4);

	.glyph {
		font-size: 18px;
		line-height: 1;
		flex: none;
	}
	.time {
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		color: rgba(255, 255, 255, 0.8);
		flex: none;
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		gap: 10px;
		padding: 10px 16px;
	}
`;

export const Scrub = styled.div`
	flex: 1;
	height: 4px;
	border-radius: 2px;
	background: rgba(255, 255, 255, 0.25);
	position: relative;

	&::after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 38%;
		background: var(--mm-gold-500);
		border-radius: 2px;
	}
`;

export const PMeta = styled.div`
	display: flex;
	align-items: flex-end;
	gap: 14px;
	padding: 16px 24px;
	color: #fff;
	background: rgba(0, 0, 0, 0.5);

	.mtext {
		min-width: 0;
	}
	.mtext b {
		display: block;
		font-family: var(--mm-font-serif);
		font-size: 22px;
		font-weight: 600;
	}
	.mtext span {
		display: block;
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.7);
		margin-top: 2px;
	}
	.inq {
		margin-left: auto;
		flex: none;
	}

	@media (max-width: 640px) {
		flex-direction: column;
		align-items: stretch;
		gap: 12px;
		padding: 14px 16px;

		.mtext b {
			font-size: 19px;
		}
		.inq {
			margin-left: 0;
			width: 100%;
		}
	}
`;
