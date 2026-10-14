"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components";
import { STUDIO, waLink } from "@/constants/studio";
import {
	Card,
	DefList,
	inquiryTone,
	Muted,
	PaneHead,
	Pill,
	Seg,
	Split,
	Stack,
} from "@/libs/adminUi";
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
	createdAt: string;
}

const STATUSES: InquiryStatus[] = ["New", "Under review", "Booked", "Completed"];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminInquiryDetailWrapper({ id }: { id: string }) {
	const { data, isLoading, mutate } = useSWR<ApiInquiry>(`/api/admin/inquiries/${id}`, fetcher);
	const [pending, setPending] = useState<InquiryStatus | null>(null);

	const status = pending ?? data?.status ?? "New";

	const changeStatus = async (next: InquiryStatus) => {
		setPending(next);
		await fetch(`/api/admin/inquiries/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status: next }),
		});
		await mutate();
	};

	if (isLoading) return <Muted>Loading inquiry…</Muted>;
	if (!data?.id) {
		return (
			<>
				<PaneHead>
					<div>
						<h1>Inquiry not found</h1>
						<p>It may have been removed.</p>
					</div>
				</PaneHead>
				<Button variant="outline" href="/admin/inquiries">
					Back to inquiries
				</Button>
			</>
		);
	}

	const message = `Hi ${data.name}, thank you for your inquiry to ${STUDIO.name} about ${data.service}. I'd love to talk through the details.`;

	return (
		<>
			<PaneHead>
				<div>
					<h1>{data.name}</h1>
					<p>
						{data.service} · received {data.createdAt}
					</p>
				</div>
				<div className="actions">
					<Pill $tone={inquiryTone(status)}>{status}</Pill>
				</div>
			</PaneHead>

			<Split>
				<Card>
					<h2>The inquiry</h2>
					<DefList>
						<div>
							<dt>Contact</dt>
							<dd>
								{data.name} · {data.phone}
							</dd>
						</div>
						<div>
							<dt>Requested service</dt>
							<dd>{data.service}</dd>
						</div>
						<div>
							<dt>Proposed dates</dt>
							<dd>{data.date}</dd>
						</div>
						<div>
							<dt>Location</dt>
							<dd>{data.location}</dd>
						</div>
						<div>
							<dt>Project vision</dt>
							<dd>
								{data.vision ? (
									data.vision
								) : (
									<Muted>No project vision provided.</Muted>
								)}
							</dd>
						</div>
					</DefList>
				</Card>

				<Card>
					<h2>Move this inquiry</h2>
					<Stack>
						<Seg>
							{STATUSES.map((s) => (
								<button
									type="button"
									key={s}
									data-on={s === status}
									onClick={() => changeStatus(s)}
								>
									{s}
								</button>
							))}
						</Seg>
						<Button variant="wa" block href={waLink(message)}>
							Reply on WhatsApp
						</Button>
						<Muted>
							Received {data.createdAt} · {data.phone}
						</Muted>
					</Stack>
				</Card>
			</Split>
		</>
	);
}
