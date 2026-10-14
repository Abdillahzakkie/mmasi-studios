import type { Metadata } from "next";
import AdminMediaWrapper from "@/libs/AdminMediaWrapper";

export const metadata: Metadata = {
	title: "Media — Studio admin",
};

export default function AdminMediaPage() {
	return <AdminMediaWrapper />;
}
