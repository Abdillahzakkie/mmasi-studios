import type { ReactNode } from "react";
import { AdminRail } from "@/layouts";
import { Pane, Shell } from "./styled";

/** Server shell for every /admin route: the left rail and a light-themed pane. */
export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<Shell data-theme="light">
			<AdminRail />
			<Pane>{children}</Pane>
		</Shell>
	);
}
