"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiMoon, FiSun } from "react-icons/fi";
import { Button } from "@/components";
import { DEFAULT_WA_MESSAGE, NAV, waLink } from "@/constants/studio";
import { useTheme } from "@/hooks";
import Brandmark from "@/layouts/Brandmark";
import MobileDrawer from "@/layouts/MobileDrawer";
import { Header } from "./styled";

export default function SiteHeader() {
	const pathname = usePathname();
	const { theme, toggleTheme } = useTheme();
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<>
			<Header>
				<Brandmark />
				<nav className="nav">
					{NAV.map((n) => (
						<Link
							key={n.href}
							href={n.href}
							className="navlink"
							data-on={pathname === n.href}
						>
							{n.label}
						</Link>
					))}
				</nav>
				<div className="trail">
					<button
						type="button"
						className="iconbtn"
						aria-label={
							theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
						}
						onClick={toggleTheme}
					>
						{theme === "dark" ? <FiSun /> : <FiMoon />}
					</button>
					<span className="wa-full">
						<Button variant="wa" size="sm" href={waLink(DEFAULT_WA_MESSAGE)}>
							Book on WhatsApp
						</Button>
					</span>
					<button
						type="button"
						className="iconbtn hamburger"
						aria-label="Open menu"
						onClick={() => setMenuOpen(true)}
					>
						<FiMenu />
					</button>
				</div>
			</Header>
			{menuOpen && <MobileDrawer onClose={() => setMenuOpen(false)} />}
		</>
	);
}
