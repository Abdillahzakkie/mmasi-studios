"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

/**
 * Collects styled-components' styles during server render and flushes them into
 * the document head, so the first paint is styled and the client class names
 * match the server's. The standard Next App Router pattern; on the client it
 * passes children through untouched.
 */
export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
	const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

	useServerInsertedHTML(() => {
		const styles = styledComponentsStyleSheet.getStyleElement();
		styledComponentsStyleSheet.instance.clearTag();
		return <>{styles}</>;
	});

	if (typeof window !== "undefined") return <>{children}</>;

	return (
		<StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
			{children}
		</StyleSheetManager>
	);
}
