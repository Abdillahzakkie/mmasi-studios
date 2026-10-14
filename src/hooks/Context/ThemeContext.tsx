"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (t: Theme) => void;
}

const STORAGE_KEY = "mmasiejikeme:theme";

const ThemeContext = createContext<ThemeContextValue>({
	theme: "dark",
	toggleTheme: () => {},
	setTheme: () => {},
});

/**
 * The cinematic dark is the studio's lead look, so it is the default. The
 * visitor's choice persists per browser; it is applied as `data-theme` on the
 * document element, which the tokens in global.ts switch on.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("dark");

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
			if (stored === "light" || stored === "dark") setThemeState(stored);
		} catch {
			// private mode or blocked storage: keep the default.
		}
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			// ignore: the attribute is what actually themes the page.
		}
	}, [theme]);

	const setTheme = useCallback((t: Theme) => setThemeState(t), []);
	const toggleTheme = useCallback(
		() => setThemeState((t) => (t === "dark" ? "light" : "dark")),
		[],
	);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => useContext(ThemeContext);
