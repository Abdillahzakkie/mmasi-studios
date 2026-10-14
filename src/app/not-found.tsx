import Link from "next/link";
import { Button } from "@/components";
import { Brandmark } from "@/layouts";

export default function NotFound() {
	return (
		<div
			style={{
				minHeight: "100dvh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					height: "var(--mm-header-h)",
					display: "flex",
					alignItems: "center",
					padding: "0 var(--mm-space-6)",
					borderBottom: "1px solid var(--mm-line)",
				}}
			>
				<Brandmark />
			</div>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
					gap: "16px",
					padding: "40px",
				}}
			>
				<p
					style={{
						fontSize: "11px",
						fontWeight: 700,
						letterSpacing: "0.24em",
						textTransform: "uppercase",
						color: "var(--mm-gold-600)",
					}}
				>
					404
				</p>
				<h1 style={{ fontSize: "clamp(28px, 5vw, 44px)" }}>This frame has moved</h1>
				<p style={{ color: "var(--mm-ink-3)", maxWidth: "40ch" }}>
					The page you followed is not here. The work, though, is all still waiting.
				</p>
				<Button href="/photography" size="lg">
					Back to the portfolio
				</Button>
				<Link
					href="/"
					style={{ color: "var(--mm-ink-3)", fontSize: "14px", marginTop: "4px" }}
				>
					Return home
				</Link>
			</div>
		</div>
	);
}
