import type { Metadata } from "next";
import AdminPortfolioWrapper from "@/libs/AdminPortfolioWrapper";

export const metadata: Metadata = {
	title: "Portfolio — Studio admin",
};

export default function AdminPortfolioPage() {
	return <AdminPortfolioWrapper />;
}
