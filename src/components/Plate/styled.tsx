"use client";

import styled, { css } from "styled-components";
import type { Tone } from "@/types";

const tones: Record<Tone, ReturnType<typeof css>> = {
	warm: css`
		background: radial-gradient(120% 90% at 70% 15%, rgba(216, 179, 95, 0.22), transparent 55%),
			linear-gradient(145deg, #4a3b27, #20180f 72%);
	`,
	cool: css`
		background: radial-gradient(110% 90% at 25% 10%, rgba(126, 167, 214, 0.18), transparent 55%),
			linear-gradient(150deg, #2a3340, #12161c 72%);
	`,
	portrait: css`
		background: radial-gradient(90% 70% at 50% 25%, rgba(255, 238, 214, 0.16), transparent 60%),
			linear-gradient(160deg, #4a3c33, #231b16 75%);
	`,
};

/**
 * A graded placeholder that reads as a photograph — grain and a vignette over a
 * toned gradient — so the layout is real before any image is wired. Swap for a
 * next/image when the studio's real frames are loaded.
 */
export const PlateStyled = styled.div<{ $tone: Tone; $ratio?: string }>`
	position: relative;
	overflow: hidden;
	color: rgba(255, 255, 255, 0.5);
	border-radius: inherit;
	${({ $ratio }) => $ratio && css`aspect-ratio: ${$ratio};`}
	${({ $tone }) => tones[$tone]}

	&::after {
		content: "";
		position: absolute;
		inset: 0;
		box-shadow: inset 0 0 90px rgba(0, 0, 0, 0.45);
		background-image: repeating-linear-gradient(
			0deg,
			rgba(255, 255, 255, 0.015) 0 1px,
			transparent 1px 3px
		);
		pointer-events: none;
	}
`;
