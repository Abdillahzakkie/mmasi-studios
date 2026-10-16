"use client";

import { startAuthentication } from "@simplewebauthn/browser";
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

	const goNext = () => {
		const next = new URLSearchParams(window.location.search).get("next");
		router.push(next || "/admin");
	};

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
			goNext();
		} catch {
			setError("Could not reach the studio. Try again.");
		} finally {
			setBusy(false);
		}
	};

	const signInWithPasskey = async () => {
		setBusy(true);
		setError("");
		try {
			const optRes = await fetch("/api/auth/passkey/authenticate/options", {
				method: "POST",
			});
			if (!optRes.ok) throw new Error("options");
			const optionsJSON = await optRes.json();
			const response = await startAuthentication({ optionsJSON });
			const verifyRes = await fetch("/api/auth/passkey/authenticate/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ response }),
			});
			if (!verifyRes.ok) {
				setError("That passkey was not recognised.");
				return;
			}
			goNext();
		} catch (e) {
			// A user who cancels the prompt throws NotAllowedError — not an error to shout about.
			if ((e as Error).name !== "NotAllowedError") {
				setError("Passkey sign-in is not available on this device.");
			}
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
					<Button variant="outline" block onClick={signInWithPasskey}>
						Sign in with a passkey
					</Button>
				</FormGrid>
				{error && <p className="error">{error}</p>}
				<p className="hint">
					A passkey signs you in with your fingerprint, face or device PIN — no password
					to type. Add one from Settings; email and password keep working either way.
				</p>
			</SignCard>
		</SignInShell>
	);
}
