"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components";
import { SOCIALS, STUDIO } from "@/constants/studio";
import { Card, FormGrid, Muted, PaneHead, Stack, ToggleRow } from "@/libs/adminUi";
import PasskeysCard from "./PasskeysCard";

interface Settings {
	name?: string;
	tagline?: string;
	whatsappNumber?: string;
	whatsappDigits?: string;
	displayPhone?: string;
	email?: string;
	base?: string;
	availability?: string;
	responseTime?: string;
	socials?: { label: string; href: string }[];
	showResponseGuarantee?: boolean;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminSettingsWrapper() {
	const { data, mutate } = useSWR<Settings>("/api/admin/settings", fetcher);

	const [whatsapp, setWhatsapp] = useState(STUDIO.whatsappNumber);
	const [display, setDisplay] = useState(STUDIO.whatsappNumber);
	const [email, setEmail] = useState(STUDIO.email);
	const [base, setBase] = useState(STUDIO.base);
	const [availability, setAvailability] = useState(STUDIO.availability);
	const [socials, setSocials] = useState(() => SOCIALS.map((s) => s.href));
	const [guarantee, setGuarantee] = useState(true);
	const [busy, setBusy] = useState(false);

	// Seed the form from the stored settings once they load (and after a save).
	useEffect(() => {
		if (!data) return;
		setWhatsapp(data.whatsappNumber ?? STUDIO.whatsappNumber);
		setDisplay(data.displayPhone ?? STUDIO.whatsappNumber);
		setEmail(data.email ?? STUDIO.email);
		setBase(data.base ?? STUDIO.base);
		setAvailability(data.availability ?? STUDIO.availability);
		setSocials(
			SOCIALS.map((s) => data.socials?.find((d) => d.label === s.label)?.href ?? s.href),
		);
		setGuarantee(data.showResponseGuarantee ?? true);
	}, [data]);

	const setSocial = (index: number, value: string) =>
		setSocials((prev) => prev.map((href, i) => (i === index ? value : href)));

	const save = async () => {
		setBusy(true);
		try {
			await fetch("/api/admin/settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: data?.name ?? STUDIO.name,
					tagline: data?.tagline ?? STUDIO.tagline,
					whatsappNumber: whatsapp,
					whatsappDigits: whatsapp.replace(/\D/g, ""),
					displayPhone: display,
					email,
					base,
					availability,
					responseTime: data?.responseTime ?? STUDIO.responseTime,
					socials: SOCIALS.map((s, i) => ({ label: s.label, href: socials[i] })),
					showResponseGuarantee: guarantee,
				}),
			});
			await mutate();
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<PaneHead>
				<div>
					<h1>Studio profile</h1>
					<p>What the public site reads back as its contact details</p>
				</div>
				<div className="actions">
					<Button variant="pri" onClick={save}>
						{busy ? "Saving…" : "Save profile"}
					</Button>
				</div>
			</PaneHead>

			<Stack>
				<Card>
					<h2>Contact</h2>
					<FormGrid>
						<div className="row2">
							<div>
								<label htmlFor="set-wa">WhatsApp number</label>
								<input
									id="set-wa"
									value={whatsapp}
									onChange={(e) => setWhatsapp(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="set-display">Display phone</label>
								<input
									id="set-display"
									value={display}
									onChange={(e) => setDisplay(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<label htmlFor="set-email">Official email</label>
							<input
								id="set-email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
					</FormGrid>
				</Card>

				<Card>
					<h2>Base &amp; reach</h2>
					<FormGrid>
						<div className="row2">
							<div>
								<label htmlFor="set-base">Physical location</label>
								<input
									id="set-base"
									value={base}
									onChange={(e) => setBase(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="set-availability">Availability</label>
								<input
									id="set-availability"
									value={availability}
									onChange={(e) => setAvailability(e.target.value)}
								/>
							</div>
						</div>
					</FormGrid>
				</Card>

				<Card>
					<h2>Social channels</h2>
					<FormGrid>
						<div className="row2">
							{SOCIALS.map((s, i) => (
								<div key={s.label}>
									<label htmlFor={`set-social-${i}`}>{s.label}</label>
									<input
										id={`set-social-${i}`}
										value={socials[i]}
										onChange={(e) => setSocial(i, e.target.value)}
									/>
								</div>
							))}
						</div>
					</FormGrid>
				</Card>

				<Card>
					<ToggleRow>
						<span className="tlabel">
							Show 24-hour response guarantee on the Contact page
						</span>
						<button
							type="button"
							data-on={guarantee}
							aria-pressed={guarantee}
							aria-label="Show 24-hour response guarantee"
							onClick={() => setGuarantee((v) => !v)}
						/>
					</ToggleRow>
					<Muted>Saved to the studio profile the public Contact page reads.</Muted>
				</Card>

				<PasskeysCard />
			</Stack>
		</>
	);
}
