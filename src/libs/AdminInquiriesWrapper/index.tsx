"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components";
import { STUDIO, waLink } from "@/constants/studio";
import { FilterBar, inquiryTone, Muted, PaneHead, Pill, TableCard } from "@/libs/adminUi";
import type { InquiryStatus } from "@/types";

interface ApiInquiry {
	id: string;
	name: string;
	phone: string;
	service: string;
	date: string;
	location: string;
	vision: string;
	status: InquiryStatus;
}

const STATUSES: ("All" | InquiryStatus)[] = ["All", "New", "Under review", "Booked", "Completed"];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function replyMessage(i: ApiInquiry): string {
	return `Hi ${i.name}, thank you for your inquiry to ${STUDIO.name} about ${i.service}. I'd love to talk through the details.`;
}

export default function AdminInquiriesWrapper() {
	const { data, isLoading } = useSWR<ApiInquiry[]>("/api/admin/inquiries", fetcher);
	const inquiries = data ?? [];
	const [status, setStatus] = useState<"All" | InquiryStatus>("All");

	const rows = useMemo(
		() => inquiries.filter((i) => status === "All" || i.status === status),
		[inquiries, status],
	);

	const newCount = inquiries.filter((i) => i.status === "New").length;

	return (
		<>
			<PaneHead>
				<div>
					<h1>Inquiries</h1>
					<p>
						{inquiries.length} inquiries · {newCount} new
					</p>
				</div>
			</PaneHead>

			<FilterBar>
				<select
					aria-label="Filter by status"
					value={status}
					onChange={(e) => setStatus(e.target.value as "All" | InquiryStatus)}
				>
					{STATUSES.map((s) => (
						<option key={s} value={s}>
							{s === "All" ? "Status: All" : s}
						</option>
					))}
				</select>
			</FilterBar>

			{isLoading ? (
				<Muted>Loading inquiries…</Muted>
			) : (
				<TableCard>
					<table>
						<thead>
							<tr>
								<th>Client</th>
								<th>Service</th>
								<th>Proposed date</th>
								<th>Location</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((i) => (
								<tr key={i.id}>
									<td>
										<Link href={`/admin/inquiries/${i.id}`} className="title">
											{i.name}
										</Link>
										<span className="sub">{i.phone}</span>
									</td>
									<td>{i.service}</td>
									<td>{i.date}</td>
									<td>{i.location}</td>
									<td>
										<Pill $tone={inquiryTone(i.status)}>{i.status}</Pill>
									</td>
									<td>
										<div className="row-actions">
											<Button
												variant="wa"
												size="sm"
												href={waLink(replyMessage(i))}
											>
												Reply on WhatsApp
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
