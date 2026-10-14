import { SiteFooter, SiteHeader } from "@/layouts";

/**
 * The public site shell: a persistent header (visible even over the lightbox
 * and player, which portal above it) and the long editorial footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<SiteHeader />
			<main>{children}</main>
			<SiteFooter />
		</>
	);
}
