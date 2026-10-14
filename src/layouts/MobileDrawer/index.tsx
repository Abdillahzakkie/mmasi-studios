"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { Button } from "@/components";
import { DEFAULT_WA_MESSAGE, NAV, SOCIALS, waLink } from "@/constants/studio";
import Brandmark from "@/layouts/Brandmark";

const Drawer = styled.div`
	position: fixed;
	inset: 0;
	/* Above the site header (100) so the full-screen menu covers it. */
	z-index: 150;
	background: var(--mm-bg);
	display: flex;
	flex-direction: column;
	padding: 16px;
	animation: drawer-in 0.3s var(--mm-ease);

	@keyframes drawer-in {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
	}

	.dtop {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 44px;
	}
	.dclose {
		width: 44px;
		height: 44px;
		border-radius: var(--mm-r-sm);
		border: 1px solid var(--mm-line-2);
		background: transparent;
		color: var(--mm-ink-2);
		font-size: 22px;
		cursor: pointer;
	}
	nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-top: 22px;
	}
	nav a {
		font-family: var(--mm-font-serif);
		font-size: 28px;
		font-weight: 600;
		padding: 12px 4px;
		border-bottom: 1px solid var(--mm-line);
		letter-spacing: -0.01em;
	}
	nav a[data-on="true"] {
		color: var(--mm-gold-600);
	}
	.dfoot {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.socials {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}
	.socials a {
		padding: 8px 14px;
		border-radius: var(--mm-r-pill);
		border: 1px solid var(--mm-line-2);
		font-size: 13px;
		font-weight: 650;
		color: var(--mm-ink-2);
	}
`;

export default function MobileDrawer({ onClose }: { onClose: () => void }) {
	const pathname = usePathname();
	return (
		<Drawer>
			<div className="dtop">
				<Brandmark />
				<button type="button" className="dclose" aria-label="Close menu" onClick={onClose}>
					&times;
				</button>
			</div>
			<nav>
				{NAV.map((n) => (
					<Link
						key={n.href}
						href={n.href}
						onClick={onClose}
						data-on={pathname === n.href}
					>
						{n.label}
					</Link>
				))}
			</nav>
			<div className="dfoot">
				<Button variant="wa" block href={waLink(DEFAULT_WA_MESSAGE)}>
					Book on WhatsApp
				</Button>
				<div className="socials">
					{SOCIALS.map((s) => (
						<a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
							{s.label}
						</a>
					))}
				</div>
			</div>
		</Drawer>
	);
}
