"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components";
import { STUDIO, waLink } from "@/constants/studio";
import { SERVICES } from "@/data";
import { Form, Grid, Preview } from "./styled";

const SERVICE_OPTIONS = SERVICES.filter((s) => s.slug !== "tell-us-your-vision").map(
	(s) => s.title,
);

function buildMessage(f: {
	name: string;
	service: string;
	date: string;
	location: string;
	vision: string;
}): string {
	const lines = [`Hi ${STUDIO.name}, I'd like to book a session.`, ""];
	if (f.name) lines.push(`Name: ${f.name}`);
	if (f.service) lines.push(`Service: ${f.service}`);
	if (f.date) lines.push(`Date: ${f.date}`);
	if (f.location) lines.push(`Location: ${f.location}`);
	if (f.vision) lines.push(`Vision: ${f.vision}`);
	return lines.join("\n");
}

/**
 * The session inquiry builder. Fields update a live WhatsApp preview, and the
 * button opens wa.me with the exact message — so nothing is retyped and the
 * studio receives a complete, warm inquiry. §5G / §2.2 of the blueprint.
 */
export default function InquiryBuilder({ initialService = "" }: { initialService?: string }) {
	const [name, setName] = useState("");
	const [service, setService] = useState(initialService);
	const [date, setDate] = useState("");
	const [location, setLocation] = useState("");
	const [vision, setVision] = useState("");

	const message = useMemo(
		() => buildMessage({ name, service, date, location, vision }),
		[name, service, date, location, vision],
	);

	const [sending, setSending] = useState(false);

	// Save the inquiry to the studio's backend (so it reaches the admin), then
	// open WhatsApp with the same message. Saving is best-effort — a failure
	// never blocks the WhatsApp hand-off.
	async function send() {
		if (name.trim()) {
			setSending(true);
			try {
				await fetch("/api/inquiries", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name, service, date, location, vision }),
				});
			} catch {
				// best effort
			} finally {
				setSending(false);
			}
		}
		window.open(waLink(message), "_blank", "noopener");
	}

	return (
		<Grid>
			<Form>
				<div>
					<label htmlFor="iq-name">Full name</label>
					<input
						id="iq-name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Your name"
					/>
				</div>
				<div>
					<label htmlFor="iq-service">Service required</label>
					<select
						id="iq-service"
						value={service}
						onChange={(e) => setService(e.target.value)}
					>
						<option value="">Select a service</option>
						{SERVICE_OPTIONS.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>
				<div className="row2">
					<div>
						<label htmlFor="iq-date">Proposed date</label>
						<input
							id="iq-date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							placeholder="e.g. 14 December 2025"
						/>
					</div>
					<div>
						<label htmlFor="iq-location">Location / destination</label>
						<input
							id="iq-location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							placeholder="e.g. Lekki, Lagos"
						/>
					</div>
				</div>
				<div>
					<label htmlFor="iq-vision">Project vision &amp; specific requests</label>
					<textarea
						id="iq-vision"
						value={vision}
						onChange={(e) => setVision(e.target.value)}
						placeholder="Tell the studio what you are planning."
					/>
				</div>
				<Button variant="wa" size="lg" block onClick={send}>
					{sending ? "Sending…" : "Send this on WhatsApp"}
				</Button>
			</Form>

			<Preview aria-live="polite">
				<div className="wptop">
					<span className="wav" aria-hidden>
						M
					</span>
					<div>
						<b>{STUDIO.name}</b>
						<br />
						<span>Business · typically replies in an hour</span>
					</div>
				</div>
				<div className="wplabel">Message preview</div>
				<div className="wpbody">
					<div className="bubble">{message}</div>
				</div>
				<div className="wpfoot">
					<p className="hint">
						Updates live as you type. Nothing is sent until you tap the green button.
					</p>
				</div>
			</Preview>
		</Grid>
	);
}
