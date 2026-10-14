import type { Metadata } from "next";
import AdminSettingsWrapper from "@/libs/AdminSettingsWrapper";

export const metadata: Metadata = {
	title: "Studio profile — Studio admin",
};

export default function AdminSettingsPage() {
	return <AdminSettingsWrapper />;
}
