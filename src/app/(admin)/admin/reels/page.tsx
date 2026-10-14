import type { Metadata } from "next";
import AdminReelsWrapper from "@/libs/AdminReelsWrapper";

export const metadata: Metadata = {
	title: "Reels & films — Studio admin",
};

export default function AdminReelsPage() {
	return <AdminReelsWrapper />;
}
