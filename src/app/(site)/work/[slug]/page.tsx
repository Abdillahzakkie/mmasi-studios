import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyWrapper from "@/libs/CaseStudyWrapper";
import { getCaseStudy } from "@/server/data";
import type { CaseStudy } from "@/types";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const study = await getCaseStudy(slug);
	if (!study) return { title: "Project — MmasiEjikeme Studios" };
	return {
		title: `${study.title} — MmasiEjikeme Studios`,
		description: String(study.vision ?? "").slice(0, 150),
	};
}

export const dynamic = "force-dynamic";

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const study = await getCaseStudy(slug);
	if (!study) notFound();
	return <CaseStudyWrapper study={study as unknown as CaseStudy} />;
}
