"use client";

import Link from "next/link";
import styled from "styled-components";
import { NAV, SOCIALS, STUDIO } from "@/constants/studio";

const Footer = styled.footer`
	background: var(--mm-surface);
	border-top: 1px solid var(--mm-line);
	padding: var(--mm-space-10) var(--mm-space-6);
	display: flex;
	gap: 48px;
	align-items: flex-start;
	flex-wrap: wrap;

	@media (max-width: 640px) {
		flex-direction: column;
		gap: 24px;
		padding: var(--mm-space-8) var(--mm-space-4);
	}

	.fcol {
		display: flex;
		flex-direction: column;
		gap: 7px;
		font-size: 13px;
		color: var(--mm-ink-3);
	}
	.fcol b {
		color: var(--mm-ink);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-bottom: 3px;
	}
	.fcol a {
		color: var(--mm-ink-2);
	}
	.fbrand {
		font-family: var(--mm-font-serif);
		font-size: 22px;
		color: var(--mm-ink);
		max-width: 28ch;
	}
	.wa {
		color: var(--mm-wa-600);
		font-weight: 600;
	}
`;

export default function SiteFooter() {
	return (
		<Footer>
			<div className="fcol" style={{ marginRight: "auto" }}>
				<div className="fbrand">{STUDIO.name}</div>
				<span>{STUDIO.tagline}</span>
			</div>
			<div className="fcol">
				<b>Explore</b>
				{NAV.filter((n) => n.href !== "/").map((n) => (
					<Link key={n.href} href={n.href}>
						{n.label}
					</Link>
				))}
			</div>
			<div className="fcol">
				<b>Studio</b>
				<span>
					{STUDIO.base} · {STUDIO.availability.replace("Available ", "")}
				</span>
				<a className="wa" href={`https://wa.me/${STUDIO.whatsappDigits}`}>
					{STUDIO.whatsappNumber}
				</a>
				<a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
			</div>
			<div className="fcol">
				<b>Follow</b>
				{SOCIALS.map((s) => (
					<a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
						{s.label}
					</a>
				))}
			</div>
		</Footer>
	);
}
