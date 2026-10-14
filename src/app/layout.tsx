import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import BodyWrapper from "@/components/BodyWrapper";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";

const playfair = Playfair_Display({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-serif-loaded",
	display: "swap",
});

const inter = Inter({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-sans-loaded",
	display: "swap",
});

export const metadata: Metadata = {
	title: "MmasiEjikeme Studios — Visual Stories. Timeless Frames.",
	description:
		"Fine-art photography, luxury cinematography and editorial portraiture. Based in Lagos, Nigeria, working worldwide. Book a session on WhatsApp.",
};

export const viewport: Viewport = {
	themeColor: "#0b0a09",
};

// Set the theme attribute before first paint so the cinematic dark never
// flashes to light on load. Falls back to the studio's dark lead.
const themeScript = `
try {
  var t = localStorage.getItem('mmasiejikeme:theme');
  document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
} catch (e) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" data-theme="dark" className={`${playfair.variable} ${inter.variable}`}>
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: tiny trusted anti-FOUC script */}
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body>
				<StyledComponentsRegistry>
					<BodyWrapper>{children}</BodyWrapper>
				</StyledComponentsRegistry>
				<div id="modal-root" />
			</body>
		</html>
	);
}
