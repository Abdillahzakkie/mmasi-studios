import type { Metadata } from "next";
import AdminSignInWrapper from "@/libs/AdminSignInWrapper";

export const metadata: Metadata = {
	title: "Sign in — Studio admin",
};

export default function SignInPage() {
	return <AdminSignInWrapper />;
}
