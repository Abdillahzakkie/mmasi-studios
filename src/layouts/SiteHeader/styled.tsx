"use client";

import styled from "styled-components";

export const Header = styled.header`
	position: sticky;
	top: 0;
	/* Above the modal scrim (90) so the header stays visible and clickable over
	   the lightbox and player; below the mobile drawer (150), which covers it. */
	z-index: 100;
	display: flex;
	align-items: center;
	gap: 20px;
	height: var(--mm-header-h);
	padding: 0 var(--mm-space-6);
	background: color-mix(in srgb, var(--mm-surface) 72%, transparent);
	border-bottom: 1px solid var(--mm-line);
	backdrop-filter: blur(8px);

	@media (max-width: 900px) {
		height: 60px;
		padding: 0 var(--mm-space-4);
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 4px;
		margin: 0 auto;
	}
	.navlink {
		padding: 8px 13px;
		border-radius: var(--mm-r-sm);
		font-size: 14px;
		font-weight: 600;
		color: var(--mm-ink-2);
		letter-spacing: 0.01em;
		white-space: nowrap;
		position: relative;
	}
	.navlink[data-on="true"] {
		color: var(--mm-ink);
	}
	.navlink[data-on="true"]::after {
		content: "";
		display: block;
		height: 1.5px;
		background: var(--mm-gold-500);
		margin: 3px 11px 0;
	}

	.trail {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: none;
	}

	.iconbtn {
		width: 38px;
		height: 38px;
		border-radius: var(--mm-r-pill);
		border: 1px solid var(--mm-line-2);
		background: var(--mm-surface);
		color: var(--mm-ink-3);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		cursor: pointer;
		flex: none;
	}
	.hamburger {
		display: none;
	}

	@media (max-width: 900px) {
		.nav {
			display: none;
		}
		.wa-full {
			display: none;
		}
		.hamburger {
			display: flex;
		}
	}
`;
