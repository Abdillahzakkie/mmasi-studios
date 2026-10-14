"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components";
import { STUDIO } from "@/constants/studio";
import { Brandmark } from "@/layouts";
import { FormGrid } from "@/libs/adminUi";
import { SignCard, SignInShell } from "./styled";

/** The shared studio sign-in: one centred card, no rail. Matches adm-signin. */
export default function AdminSignInWrapper() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);

	const submit = async () => {
		setBusy(true);
		setError("");
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (!res.ok) {
				setError("Those credentials were not recognised.");
				return;
			}
			const next = new URLSearchParams(window.location.search).get("next");
			router.push(next || "/admin");
		} catch {
			setError("Could not reach the studio. Try again.");
		} finally {
			setBusy(false);
		}
	};

	return (
		<SignInShell data-theme="light">
			<SignCard>
				<div className="brand">
					<Brandmark />
				</div>
				<FormGrid>
					<div>
						<label htmlFor="si-email">Studio email</label>
						<input
							id="si-email"
							type="email"
							autoComplete="email"
							placeholder={STUDIO.email}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") submit();
							}}
						/>
					</div>
					<div>
						<label htmlFor="si-password">Password</label>
						<input
							id="si-password"
							type="password"
							autoComplete="current-password"
							placeholder="••••••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") submit();
							}}
						/>
					</div>
					<Button variant="pri" block onClick={submit}>
						{busy ? "Signing in…" : "Sign in to the studio"}
					</Button>
				</FormGrid>
				{error && <p className="error">{error}</p>}
				<p className="hint">One account for the whole studio.</p>
			</SignCard>
		</SignInShell>
	);
}
