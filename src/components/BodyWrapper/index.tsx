"use client";

import { ThemeProvider } from "@/hooks";
import { GlobalStyle } from "@/styles";

/**
 * The client provider stack mounted once under the SSR registry: the global
 * token stylesheet and the theme provider that the whole site reads.
 */
export default function BodyWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<GlobalStyle />
			{children}
		</ThemeProvider>
	);
}
