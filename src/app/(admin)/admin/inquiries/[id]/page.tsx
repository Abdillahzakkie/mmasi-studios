import type { Metadata } from "next";
import AdminInquiryDetailWrapper from "@/libs/AdminInquiryDetailWrapper";

export const metadata: Metadata = {
	title: "Inquiry — Studio admin",
};

export default async function AdminInquiryDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <AdminInquiryDetailWrapper id={id} />;
}
