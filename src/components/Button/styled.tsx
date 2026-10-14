"use client";

import styled, { css } from "styled-components";

export type ButtonVariant = "pri" | "outline" | "ghost" | "gold" | "wa" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const sizes: Record<ButtonSize, ReturnType<typeof css>> = {
	sm: css`height: 36px; padding: 0 14px; font-size: 13px;`,
	md: css`height: 50px; padding: 0 20px; font-size: 16px;`,
	lg: css`height: 56px; padding: 0 26px; font-size: 17px; border-radius: var(--mm-r);`,
};

const variants: Record<ButtonVariant, ReturnType<typeof css>> = {
	pri: css`
		/* Token-driven so the nearest theme wins: ink on the editorial light,
		   champagne on the cinematic dark. Using an ancestor selector here broke
		   the admin, which is a light subtree inside the dark <html>. */
		background: var(--mm-pri-bg);
		border-color: var(--mm-pri-bg);
		color: var(--mm-pri-fg);
	`,
	gold: css`
		background: var(--mm-gold-500);
		border-color: var(--mm-gold-500);
		color: #1a1510;
	`,
	outline: css`
		background: transparent;
		border-color: currentColor;
		color: inherit;
	`,
	ghost: css`
		background: transparent;
		border-color: transparent;
		color: inherit;
	`,
	wa: css`
		background: var(--mm-wa);
		border-color: var(--mm-wa);
		color: var(--mm-wa-ink);
	`,
	danger: css`
		background: var(--mm-danger);
		border-color: var(--mm-danger);
		color: #fff;
	`,
};

export const ButtonStyled = styled.button<{
	$variant: ButtonVariant;
	$size: ButtonSize;
	$block?: boolean;
}>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	border: 1px solid var(--mm-line-2);
	border-radius: var(--mm-r-sm);
	font-family: var(--mm-font-sans);
	font-weight: 650;
	letter-spacing: 0.01em;
	white-space: nowrap;
	cursor: pointer;
	text-decoration: none;
	transition: transform 0.15s var(--mm-ease), opacity 0.15s var(--mm-ease),
		background 0.2s var(--mm-ease);
	${({ $size }) => sizes[$size]}
	${({ $variant }) => variants[$variant]}
	${({ $block }) => $block && css`width: 100%;`}

	&:hover {
		opacity: 0.92;
		transform: translateY(-1px);
	}
	&:active {
		transform: translateY(0);
	}
`;

/** The WhatsApp speech-bubble glyph, drawn in one span (no asset). */
export const WaGlyph = styled.span`
	width: 17px;
	height: 17px;
	border-radius: 50% 50% 50% 2px;
	background: currentColor;
	position: relative;
	flex: none;

	&::after {
		content: "";
		position: absolute;
		inset: 4px;
		border-radius: 50%;
		border: 2px solid var(--mm-wa);
		border-right-color: transparent;
		transform: rotate(38deg);
	}
`;
