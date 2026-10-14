"use client";

import { createGlobalStyle } from "styled-components";

/**
 * The single source of design tokens for the studio site.
 *
 * These `--mm-*` custom properties are the same values the contact sheets in
 * design/mockups/system.css are drawn with — the mockup and the build read one
 * vocabulary. Light is the editorial base; `[data-theme="dark"]` is the
 * cinematic lead the homepage and galleries open in.
 *
 * Fonts come from next/font (see src/app/layout.tsx) as the CSS variables
 * --font-serif-loaded and --font-sans-loaded; the tokens below fall back to
 * system fonts so nothing depends on the network to render.
 */
const GlobalStyle = createGlobalStyle`
	:root {
		/* Champagne gold — the single accent. */
		--mm-gold-50:#faf4e6; --mm-gold-100:#f3e6c6; --mm-gold-200:#e7cf93;
		--mm-gold-300:#d8b35f; --mm-gold-400:#c99f42; --mm-gold-500:#b4872f;
		--mm-gold-600:#8f6a21; --mm-gold-700:#6d5017;

		--mm-ink:#1a1714; --mm-ink-2:#4a433c; --mm-ink-3:#7a7268; --mm-ink-4:#a89f93;
		--mm-bg:#f6f3ee; --mm-surface:#fffdf9; --mm-surface-2:#efe9e0;
		--mm-line:#e7e0d5; --mm-line-2:#d6ccbd;

		--mm-ok:#2f7d4f; --mm-ok-bg:#e6f3ea;
		--mm-warn:#8a5a12; --mm-warn-bg:#f8efdd;
		--mm-danger:#a33636; --mm-danger-bg:#f8e9e7;
		--mm-info:#355f8f; --mm-info-bg:#e9f0f8;
		--mm-accent:var(--mm-gold-500);

		/* Primary button colour, resolved by theme so a light subtree (the admin)
		   gets ink even though <html> is dark. */
		--mm-pri-bg:var(--mm-ink); --mm-pri-fg:var(--mm-bg);

		--mm-wa:#25d366; --mm-wa-600:#1ba94e; --mm-wa-ink:#ffffff; --mm-wa-bg:#e7f8ee;

		--mm-r-sm:5px; --mm-r:10px; --mm-r-lg:16px; --mm-r-pill:999px;
		--mm-shadow:0 1px 2px rgba(20,16,10,.05), 0 8px 24px rgba(20,16,10,.06);
		--mm-shadow-lg:0 24px 60px rgba(12,10,6,.22);

		/* 4px spacing scale */
		--mm-space-1:4px; --mm-space-2:8px; --mm-space-3:12px; --mm-space-4:16px;
		--mm-space-5:20px; --mm-space-6:24px; --mm-space-8:32px; --mm-space-10:40px;
		--mm-space-13:52px; --mm-space-16:64px;

		/* Type */
		--mm-font-serif: var(--font-serif-loaded), Georgia, "Iowan Old Style", "Times New Roman", serif;
		--mm-font-sans: var(--font-sans-loaded), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		--mm-font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;

		--mm-header-h:72px;
		--mm-content-max:1440px;

		--mm-ease:cubic-bezier(.22,.61,.36,1);
		--mm-dur:.5s;

		color-scheme: light;
	}

	[data-theme="dark"] {
		--mm-ink:#f3ede3; --mm-ink-2:#cabfae; --mm-ink-3:#938a7c; --mm-ink-4:#6b6356;
		--mm-bg:#0b0a09; --mm-surface:#141210; --mm-surface-2:#1e1b16;
		--mm-line:#2a261f; --mm-line-2:#3a352b;
		--mm-gold-500:#d8b35f; --mm-gold-600:#d8b35f; --mm-gold-700:#e7cf93;
		--mm-gold-50:#1e1a12; --mm-gold-100:#2a2416;
		--mm-ok:#4fc27e; --mm-ok-bg:#12241a; --mm-warn:#e0a94a; --mm-warn-bg:#2a2010;
		--mm-danger:#e88a86; --mm-danger-bg:#2c1716; --mm-info:#7ea7d6; --mm-info-bg:#131f2d;
		--mm-wa-bg:#11291c;
		--mm-pri-bg:var(--mm-gold-500); --mm-pri-fg:#1a1510;
		--mm-shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 30px rgba(0,0,0,.5);
		color-scheme: dark;
	}

	*, *::before, *::after { box-sizing: border-box; }

	html, body {
		margin: 0;
		padding: 0;
	}

	body {
		background: var(--mm-bg);
		color: var(--mm-ink);
		font-family: var(--mm-font-sans);
		font-size: 16px;
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
		transition: background var(--mm-dur) var(--mm-ease), color var(--mm-dur) var(--mm-ease);
	}

	h1, h2, h3, h4 {
		font-family: var(--mm-font-serif);
		font-weight: 600;
		letter-spacing: -0.015em;
		margin: 0;
	}

	a { color: inherit; text-decoration: none; }
	img { max-width: 100%; display: block; }
	button { font-family: inherit; }

	:focus-visible {
		outline: 2px solid var(--mm-gold-500);
		outline-offset: 2px;
		border-radius: 3px;
	}

	@media (prefers-reduced-motion: reduce) {
		*, *::before, *::after {
			animation-duration: 0.001ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.001ms !important;
			scroll-behavior: auto !important;
		}
	}
`;

export default GlobalStyle;
