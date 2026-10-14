"use client";

import styled, { css } from "styled-components";

/** A centered content column, capped at the site width. */
export const Container = styled.div`
	width: 100%;
	max-width: var(--mm-content-max);
	margin: 0 auto;
	padding: 0 var(--mm-space-6);

	@media (max-width: 640px) {
		padding: 0 var(--mm-space-4);
	}
`;

/** A vertical band with editorial breathing room. */
export const Section = styled.section<{ $flush?: boolean; $tight?: boolean }>`
	padding: ${({ $tight }) => ($tight ? "var(--mm-space-8)" : "var(--mm-space-13)")} 0;
	${({ $flush }) => $flush && css`padding-top: 0;`}

	@media (max-width: 640px) {
		padding: var(--mm-space-8) 0;
		${({ $flush }) => $flush && css`padding-top: 0;`}
	}
`;

export const Eyebrow = styled.p`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.24em;
	text-transform: uppercase;
	color: var(--mm-gold-600);
	margin: 0 0 var(--mm-space-2);
`;

export const SectionHead = styled.div`
	display: flex;
	align-items: flex-end;
	gap: var(--mm-space-4);
	margin-bottom: var(--mm-space-6);

	h2 {
		font-size: clamp(26px, 3vw, 36px);
		line-height: 1.08;
	}
	p {
		color: var(--mm-ink-3);
		font-size: 14px;
		max-width: 48ch;
		margin: var(--mm-space-1) 0 0;
	}
	.trail {
		margin-left: auto;
		flex: none;
	}

	@media (max-width: 640px) {
		flex-direction: column;
		align-items: flex-start;
		.trail {
			margin-left: 0;
		}
	}
`;
