import type { Metadata } from "next";
import AdminInquiriesWrapper from "@/libs/AdminInquiriesWrapper";

export const metadata: Metadata = {
	title: "Inquiries — Studio admin",
};

export default function AdminInquiriesPage() {
	return <AdminInquiriesWrapper />;
}
