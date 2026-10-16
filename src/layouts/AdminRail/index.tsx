"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import useSWR from "swr";
import { can, type Permissions, type Resource } from "@/constants/iam";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const initials = (s: string) =>
	s
		.split(/[\s@.]+/)
		.map((w) => w[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase() || "ME";

const Rail = styled.nav`
	width: 236px;
	flex: none;
	background: var(--mm-surface);
	border-right: 1px solid var(--mm-line);
	display: flex;
	flex-direction: column;
	padding: 16px 12px;
	gap: 2px;

	@media (max-width: 820px) {
		width: 64px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 4px 8px 16px;
		font-family: var(--mm-font-serif);
		font-weight: 700;
		font-size: 16px;
		color: var(--mm-ink);
	}
	.mono-m {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 1.5px solid var(--mm-gold-500);
		color: var(--mm-gold-600);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		flex: none;
	}
	.rentry {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 11px;
		border-radius: var(--mm-r-sm);
		color: var(--mm-ink-2);
		font-size: 14px;
		font-weight: 550;
	}
	.rentry[data-on="true"] {
		background: var(--mm-gold-50);
		color: var(--mm-gold-700);
		font-weight: 650;
	}
	.ic {
		width: 16px;
		height: 16px;
		border-radius: 4px;
		background: currentColor;
		opacity: 0.5;
		flex: none;
	}
	.rentry[data-on="true"] .ic {
		opacity: 0.9;
	}
	.count {
		margin-left: auto;
		font-size: 11px;
		font-weight: 700;
		background: var(--mm-surface-2);
		border-radius: var(--mm-r-pill);
		padding: 1px 8px;
		color: var(--mm-ink-3);
	}
	.rentry[data-on="true"] .count {
		background: var(--mm-gold-100);
		color: var(--mm-gold-700);
	}
	.spacer {
		flex: 1;
	}
	.ruser {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 8px;
		border-top: 1px solid var(--mm-line);
		font-size: 13px;
		color: var(--mm-ink-2);
	}
	.av {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--mm-surface-2);
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 12px;
	}
	.signout {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 11px;
		margin-top: 2px;
		border-radius: var(--mm-r-sm);
		border: none;
		background: none;
		width: 100%;
		text-align: left;
		cursor: pointer;
		font: inherit;
		font-size: 14px;
		font-weight: 550;
		color: var(--mm-ink-2);
	}
	.signout:hover {
		background: var(--mm-surface-2);
		color: var(--mm-ink);
	}

	@media (max-width: 820px) {
		.brand span:last-child,
		.rentry span:not(.ic):not(.count),
		.ruser span:last-child,
		.signout span:not(.ic) {
			display: none;
		}
	}
`;

const ENTRIES: { href: string; label: string; resource: Resource }[] = [
	{ href: "/admin", label: "Portfolio", resource: "portfolio" },
	{ href: "/admin/reels", label: "Reels & Films", resource: "reels" },
	{ href: "/admin/casestudies", label: "Case studies", resource: "casestudies" },
	{ href: "/admin/services", label: "Services", resource: "services" },
	{ href: "/admin/content", label: "Page content", resource: "content" },
	{ href: "/admin/media", label: "Media", resource: "media" },
	{ href: "/admin/inquiries", label: "Inquiries", resource: "inquiries" },
	{ href: "/admin/settings", label: "Settings", resource: "settings" },
	{ href: "/admin/access", label: "Access & team", resource: "iam" },
];

interface Me {
	name?: string;
	email?: string;
	permissions?: Permissions;
}

export default function AdminRail() {
	const pathname = usePathname();
	// Live count of New inquiries from the backend (0 while loading).
	const { data } = useSWR<{ status: string }[]>("/api/admin/inquiries", fetcher);
	const newCount = Array.isArray(data) ? data.filter((i) => i.status === "New").length : 0;
	const { data: me } = useSWR<Me>("/api/auth/me", fetcher);
	const perms = me?.permissions;
	// Fail open while permissions are still loading or absent — the API enforces
	// access regardless, so the rail only hides what a teammate truly can't open.
	const entries = ENTRIES.filter((e) => !perms || can(perms, e.resource, "read"));
	const who = me?.name || me?.email || "MmasiEjikeme";
	const signOut = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		// Full reload so no cached admin state survives the sign-out.
		window.location.href = "/signin";
	};
	return (
		<Rail>
			<div className="brand">
				<span className="mono-m" aria-hidden>
					M
				</span>
				<span>MmasiEjikeme</span>
			</div>
			{entries.map((e) => {
				const on = e.href === "/admin" ? pathname === e.href : pathname.startsWith(e.href);
				return (
					<Link key={e.href} href={e.href} className="rentry" data-on={on}>
						<span className="ic" aria-hidden />
						<span>{e.label}</span>
						{e.label === "Inquiries" && newCount > 0 && (
							<span className="count">{newCount}</span>
						)}
					</Link>
				);
			})}
			<div className="spacer" />
			<div className="ruser">
				<span className="av">{initials(who)}</span>
				<span>{who}</span>
			</div>
			<button type="button" className="signout" onClick={signOut}>
				<span className="ic" aria-hidden />
				<span>Sign out</span>
			</button>
		</Rail>
	);
}
