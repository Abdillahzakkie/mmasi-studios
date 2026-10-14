import type { Metadata } from "next";
import AdminServicesWrapper from "@/libs/AdminServicesWrapper";

export const metadata: Metadata = {
	title: "Services — Studio admin",
};

export default function AdminServicesPage() {
	return <AdminServicesWrapper />;
}
