"use client";

import { startRegistration } from "@simplewebauthn/browser";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components";
import { Card, Muted } from "@/libs/adminUi";

interface Passkey {
	id: string;
	deviceName: string;
	createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** A rough, friendly name for the passkey's device, from the user agent. */
function guessDeviceName(): string {
	const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
	if (/iPhone|iPad/.test(ua)) return "iPhone or iPad";
	if (/Android/.test(ua)) return "Android device";
	if (/Macintosh/.test(ua)) return "Mac";
	if (/Windows/.test(ua)) return "Windows PC";
	return "This device";
}

export default function PasskeysCard() {
	const { data, mutate } = useSWR<Passkey[]>("/api/auth/passkey", fetcher);
	const passkeys = Array.isArray(data) ? data : [];
	const [busy, setBusy] = useState(false);
	const [msg, setMsg] = useState("");

	const add = async () => {
		setBusy(true);
		setMsg("");
		try {
			const optRes = await fetch("/api/auth/passkey/register/options", { method: "POST" });
			if (!optRes.ok) throw new Error("options");
			const optionsJSON = await optRes.json();
			const response = await startRegistration({ optionsJSON });
			const res = await fetch("/api/auth/passkey/register/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ response, deviceName: guessDeviceName() }),
			});
			if (!res.ok) {
				setMsg("Could not add that passkey. Try again.");
				return;
			}
			await mutate();
		} catch (e) {
			// Cancelling the browser prompt throws NotAllowedError — not worth a message.
			if ((e as Error).name !== "NotAllowedError") {
				setMsg("Passkeys are not available on this device.");
			}
		} finally {
			setBusy(false);
		}
	};

	const remove = async (id: string) => {
		await fetch(`/api/auth/passkey/${id}`, { method: "DELETE" });
		mutate();
	};

	return (
		<Card>
			<h2>Your sign-in · passkeys</h2>
			<Muted>
				Sign in with your fingerprint, face or device PIN instead of a password. Add one per
				device; email and password still work.
			</Muted>
			{passkeys.length > 0 && (
				<div style={{ margin: "12px 0", display: "flex", flexDirection: "column", gap: 8 }}>
					{passkeys.map((p) => (
						<div
							key={p.id}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								gap: 12,
								padding: "10px 12px",
								border: "1px solid var(--mm-line)",
								borderRadius: "var(--mm-r-sm)",
							}}
						>
							<div>
								<b style={{ fontSize: 14 }}>{p.deviceName}</b>
								<div style={{ fontSize: 12, color: "var(--mm-ink-3)" }}>
									Added {new Date(p.createdAt).toLocaleDateString()}
								</div>
							</div>
							<Button variant="ghost" size="sm" onClick={() => remove(p.id)}>
								Remove
							</Button>
						</div>
					))}
				</div>
			)}
			<div style={{ marginTop: 12 }}>
				<Button variant="outline" size="sm" onClick={add}>
					{busy ? "Waiting for your device…" : "Add a passkey"}
				</Button>
			</div>
			{msg && <Muted style={{ color: "var(--mm-danger)", marginTop: 8 }}>{msg}</Muted>}
		</Card>
	);
}
