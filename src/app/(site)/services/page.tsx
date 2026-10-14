import type { Metadata } from "next";
import ServicesWrapper from "@/libs/ServicesWrapper";
import { getServices, getSiteContent } from "@/server/data";

export const metadata: Metadata = {
	title: "Services — MmasiEjikeme Studios",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
	const [services, content] = await Promise.all([getServices(), getSiteContent()]);
	return (
		<ServicesWrapper
			services={services}
			banner={content.banners.services}
			copy={content.services}
		/>
	);
}
