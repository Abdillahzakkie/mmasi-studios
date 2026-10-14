"use client";

import { css } from "styled-components";

/**
 * The admin is light editorial only. `<html>` is forced to the cinematic dark
 * for the public site, and CSS custom properties inherit, so an inner element
 * must re-declare the light token values to escape the dark cascade. Applied on
 * the admin shell, the sign-in container and the share dialog (which portals out
 * of the shell into #modal-root).
 */
export const adminLight = css`
	--mm-ink: #1a1714;
	--mm-ink-2: #4a433c;
	--mm-ink-3: #7a7268;
	--mm-ink-4: #a89f93;
	--mm-bg: #f6f3ee;
	--mm-surface: #fffdf9;
	--mm-surface-2: #efe9e0;
	--mm-line: #e7e0d5;
	--mm-line-2: #d6ccbd;
	--mm-gold-500: #b4872f;
	--mm-gold-600: #8f6a21;
	--mm-gold-700: #6d5017;
	--mm-gold-50: #faf4e6;
	--mm-gold-100: #f3e6c6;
	--mm-ok: #2f7d4f;
	--mm-ok-bg: #e6f3ea;
	--mm-warn: #8a5a12;
	--mm-warn-bg: #f8efdd;
	--mm-danger: #a33636;
	--mm-danger-bg: #f8e9e7;
	--mm-info: #355f8f;
	--mm-info-bg: #e9f0f8;
	--mm-wa-bg: #e7f8ee;
	--mm-pri-bg: #1a1714;
	--mm-pri-fg: #f6f3ee;
	--mm-shadow: 0 1px 2px rgba(20, 16, 10, 0.05), 0 8px 24px rgba(20, 16, 10, 0.06);
	color-scheme: light;
	background: var(--mm-bg);
	color: var(--mm-ink);
`;
