"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

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

	@media (max-width: 820px) {
		.brand span:last-child,
		.rentry span:not(.ic):not(.count),
		.ruser span:last-child {
			display: none;
		}
	}
`;

const ENTRIES = [
	{ href: "/admin", label: "Portfolio" },
	{ href: "/admin/reels", label: "Reels & Films" },
	{ href: "/admin/casestudies", label: "Case studies" },
	{ href: "/admin/services", label: "Services" },
	{ href: "/admin/content", label: "Content" },
	{ href: "/admin/media", label: "Media" },
	{ href: "/admin/inquiries", label: "Inquiries" },
	{ href: "/admin/settings", label: "Settings" },
];

export default function AdminRail() {
	const pathname = usePathname();
	// Live count of New inquiries from the backend (0 while loading).
	const { data } = useSWR<{ status: string }[]>("/api/admin/inquiries", fetcher);
	const newCount = Array.isArray(data) ? data.filter((i) => i.status === "New").length : 0;
	return (
		<Rail>
			<div className="brand">
				<span className="mono-m" aria-hidden>
					M
				</span>
				<span>MmasiEjikeme</span>
			</div>
			{ENTRIES.map((e) => {
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
				<span className="av">ME</span>
				<span>MmasiEjikeme</span>
			</div>
		</Rail>
	);
}
