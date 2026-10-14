"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components";
import {
	Card,
	CheckRow,
	EmptyBox,
	FormGrid,
	Muted,
	PaneHead,
	Pill,
	TableCard,
} from "@/libs/adminUi";

interface ApiService {
	id: string;
	slug: string;
	tag: string;
	title: string;
	description: string;
	investment: string;
	investmentNote: string;
	deliverables: string[];
	feature: boolean;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

function ServiceForm({ service, onDone }: { service: ApiService | null; onDone: () => void }) {
	const [tag, setTag] = useState(service?.tag ?? "");
	const [title, setTitle] = useState(service?.title ?? "");
	const [description, setDescription] = useState(service?.description ?? "");
	const [investment, setInvestment] = useState(service?.investment ?? "");
	const [investmentNote, setInvestmentNote] = useState(service?.investmentNote ?? "");
	const [deliverables, setDeliverables] = useState((service?.deliverables ?? []).join("\n"));
	const [feature, setFeature] = useState(service?.feature ?? false);
	const [busy, setBusy] = useState(false);

	const save = async () => {
		setBusy(true);
		const payload = {
			tag,
			title,
			description,
			investment,
			investmentNote,
			deliverables: deliverables
				.split("\n")
				.map((d) => d.trim())
				.filter(Boolean),
			feature,
			...(service ? {} : { slug: slugify(title) || `service-${Date.now()}` }),
		};
		try {
			await fetch(service ? `/api/admin/services/${service.id}` : "/api/admin/services", {
				method: service ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			onDone();
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<PaneHead>
				<div>
					<h1>{service ? "Edit service" : "Add service"}</h1>
					<p>{service ? service.title : "A new offering for the Services page"}</p>
				</div>
				<div className="actions">
					<Button variant="outline" onClick={onDone}>
						Cancel
					</Button>
					<Button variant="pri" onClick={save}>
						{busy ? "Saving…" : "Save service"}
					</Button>
				</div>
			</PaneHead>
			<Card>
				<h2>Details</h2>
				<FormGrid>
					<div className="row2">
						<div>
							<label htmlFor="sv-tag">Tag</label>
							<input
								id="sv-tag"
								value={tag}
								onChange={(e) => setTag(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="sv-title">Title</label>
							<input
								id="sv-title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
					</div>
					<div>
						<label htmlFor="sv-desc">Description</label>
						<textarea
							id="sv-desc"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className="row2">
						<div>
							<label htmlFor="sv-invest">Investment</label>
							<input
								id="sv-invest"
								value={investment}
								onChange={(e) => setInvestment(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="sv-invest-note">Investment note</label>
							<input
								id="sv-invest-note"
								value={investmentNote}
								onChange={(e) => setInvestmentNote(e.target.value)}
							/>
						</div>
					</div>
					<div>
						<label htmlFor="sv-deliverables">Deliverables (one per line)</label>
						<textarea
							id="sv-deliverables"
							value={deliverables}
							onChange={(e) => setDeliverables(e.target.value)}
						/>
					</div>
					<CheckRow>
						<input
							type="checkbox"
							checked={feature}
							onChange={(e) => setFeature(e.target.checked)}
						/>
						Feature this service (highlighted card on the Services page)
					</CheckRow>
				</FormGrid>
			</Card>
		</>
	);
}

export default function AdminServicesWrapper() {
	const { data, isLoading, mutate } = useSWR<ApiService[]>("/api/admin/services", fetcher);
	const services = data ?? [];
	const [editing, setEditing] = useState<ApiService | "new" | null>(null);

	const remove = async (s: ApiService) => {
		await fetch(`/api/admin/services/${s.id}`, { method: "DELETE" });
		mutate();
	};

	if (editing) {
		return (
			<ServiceForm
				service={editing === "new" ? null : editing}
				onDone={() => {
					setEditing(null);
					mutate();
				}}
			/>
		);
	}

	return (
		<>
			<PaneHead>
				<div>
					<h1>Services</h1>
					<p>{services.length} offerings on the Services page</p>
				</div>
				<div className="actions">
					<Button variant="pri" onClick={() => setEditing("new")}>
						Add service
					</Button>
				</div>
			</PaneHead>

			{isLoading ? (
				<Muted>Loading services…</Muted>
			) : services.length === 0 ? (
				<EmptyBox>
					<span className="eglyph" aria-hidden />
					<h2>No services yet</h2>
					<p>Add your first offering and it appears on the public Services page.</p>
					<Button className="ebtn" variant="pri" onClick={() => setEditing("new")}>
						Add your first service
					</Button>
				</EmptyBox>
			) : (
				<TableCard>
					<table>
						<thead>
							<tr>
								<th>Service</th>
								<th>Investment</th>
								<th>Featured</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{services.map((s) => (
								<tr key={s.id}>
									<td>
										<span className="title">{s.title}</span>
										<span className="sub">{s.tag}</span>
									</td>
									<td>{s.investment}</td>
									<td>
										<Pill $tone={s.feature ? "ok" : "idle"}>
											{s.feature ? "Featured" : "Standard"}
										</Pill>
									</td>
									<td>
										<div className="row-actions">
											<Button
												variant="outline"
												size="sm"
												onClick={() => setEditing(s)}
											>
												Edit
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => remove(s)}
											>
												Delete
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</TableCard>
			)}
		</>
	);
}
