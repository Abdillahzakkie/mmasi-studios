import type { Metadata } from "next";
import AdminIamWrapper from "@/libs/AdminIamWrapper";

export const metadata: Metadata = {
	title: "Access & team — MmasiEjikeme Studios",
};

export default function AccessPage() {
	return <AdminIamWrapper />;
}
