"use client";

import styled from "styled-components";
import Plate from "@/components/Plate";

/**
 * The darkroom stage sits below the persistent header: the Modal scrim is fixed
 * inset:0, so the viewer pads its top by the header height to keep the stage and
 * spec card clear of the site header band.
 */
export const Viewer = styled.div`
	flex: 1;
	min-width: 0;
	display: flex;
	padding-top: var(--mm-header-h);

	@media (max-width: 860px) {
		flex-direction: column;
		overflow-y: auto;
	}
`;

export const Stage = styled.div`
	flex: 1;
	min-width: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 28px;
	position: relative;

	@media (max-width: 860px) {
		padding: 16px;
	}
`;

export const StagePlate = styled(Plate)`
	max-width: 100%;
	max-height: 100%;
	width: auto;
	height: 92%;
	border-radius: var(--mm-r-sm);

	@media (max-width: 860px) {
		width: 92%;
		height: auto;
	}
`;

export const Nav = styled.button<{ $side: "prev" | "next" }>`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	${({ $side }) => ($side === "prev" ? "left: 16px;" : "right: 16px;")}
	width: 48px;
	height: 48px;
	border-radius: 50%;
	border: 1px solid rgba(255, 255, 255, 0.3);
	background: transparent;
	color: #fff;
	font-size: 20px;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background 0.15s var(--mm-ease);

	&:hover {
		background: rgba(255, 255, 255, 0.12);
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const Specs = styled.aside`
	width: 340px;
	flex: none;
	background: var(--mm-surface);
	color: var(--mm-ink);
	padding: 28px 24px;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 18px;

	@media (max-width: 860px) {
		width: auto;
		flex: none;
		padding: 18px 16px;
	}
`;

export const Cat = styled.p`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--mm-gold-600);
	margin: 0;
`;

export const Title = styled.h3`
	font-family: var(--mm-font-serif);
	font-size: 26px;
	font-weight: 600;
	margin: 4px 0 0;
	line-height: 1.15;
`;

export const Caption = styled.p`
	font-size: 14px;
	color: var(--mm-ink-2);
	line-height: 1.55;
	margin: 0;
`;

export const SpecList = styled.dl`
	display: flex;
	flex-direction: column;
	gap: 0;
	border-top: 1px solid var(--mm-line);
	margin: 0;
`;

export const SpecRow = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 12px;
	padding: 10px 0;
	border-bottom: 1px solid var(--mm-line);
	font-size: 13px;

	dt {
		color: var(--mm-ink-3);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-size: 11px;
		font-weight: 650;
		margin: 0;
	}
	dd {
		font-weight: 600;
		text-align: right;
		margin: 0;
	}
`;
