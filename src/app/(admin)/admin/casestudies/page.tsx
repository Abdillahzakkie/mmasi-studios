import type { Metadata } from "next";
import AdminCaseStudiesWrapper from "@/libs/AdminCaseStudiesWrapper";

export const metadata: Metadata = {
	title: "Case studies — Studio admin",
};

export default function AdminCaseStudiesPage() {
	return <AdminCaseStudiesWrapper />;
}
