import type { Metadata } from "next";
import AdminContentWrapper from "@/libs/AdminContentWrapper";

export const metadata: Metadata = {
	title: "Site content — Studio admin",
};

export default function AdminContentPage() {
	return <AdminContentWrapper />;
}
