"use client";

import styled from "styled-components";

export const Scrim = styled.div`
	position: fixed;
	inset: 0;
	/* Below the site header (100) so the persistent nav stays visible and
	   clickable over an open lightbox or player, as the blueprint requires;
	   above all page content. */
	z-index: 90;
	background: rgba(8, 7, 6, 0.9);
	backdrop-filter: blur(2px);
	display: flex;
	animation: scrim-in 0.25s var(--mm-ease);

	@keyframes scrim-in {
		from {
			opacity: 0;
		}
	}
`;

export const CloseButton = styled.button`
	position: absolute;
	/* Sit below the persistent site header so it is never hidden behind it.
	   The admin share dialog passes hideClose, so this offset only affects the
	   site lightbox and player, which both render beneath the header. */
	top: calc(var(--mm-header-h) + 10px);
	right: 16px;
	z-index: 3;
	width: 42px;
	height: 42px;
	border-radius: 50%;
	border: 1px solid rgba(255, 255, 255, 0.3);
	background: transparent;
	color: #fff;
	font-size: 20px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		background: rgba(255, 255, 255, 0.1);
	}
`;

/** A centered card dialog, for the admin share and confirm flows. */
export const Dialog = styled.div`
	margin: auto;
	width: 460px;
	max-width: calc(100vw - 32px);
	background: var(--mm-surface);
	color: var(--mm-ink);
	border-radius: var(--mm-r-lg);
	box-shadow: var(--mm-shadow-lg);
	overflow: hidden;
	animation: dialog-in 0.25s var(--mm-ease);

	@keyframes dialog-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
`;
