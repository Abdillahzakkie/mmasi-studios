"use client";

import { Button, Plate } from "@/components";
import { serviceWaMessage, waLink } from "@/constants/studio";
import type { CaseStudy } from "@/types";
import { Body, Collaborate, Cover, Ribbon, Stack } from "./styled";

export default function CaseStudyWrapper({ study }: { study: CaseStudy }) {
	return (
		<>
			<Cover>
				<Plate
					tone={study.tone}
					className="plate-bg"
					src={study.coverUrl || undefined}
					alt={study.title}
				/>
				<div className="cbody">
					<div className="ctag">{study.category}</div>
					<h1>{study.title}</h1>
				</div>
			</Cover>

			<Ribbon>
				<div className="sr">
					<div className="k">Discipline</div>
					<div className="v">{study.category}</div>
				</div>
				<div className="sr">
					<div className="k">Client</div>
					<div className="v">{study.client}</div>
				</div>
				<div className="sr">
					<div className="k">Location</div>
					<div className="v">{study.location}</div>
				</div>
				<div className="sr">
					<div className="k">Year</div>
					<div className="v">{study.year}</div>
				</div>
				<div className="sr">
					<div className="k">Studio role</div>
					<div className="v">{study.role}</div>
				</div>
			</Ribbon>

			<Body>
				<h3>Artistic vision</h3>
				<p>{study.vision}</p>
				<h3>Production notes</h3>
				<p>{study.production}</p>
			</Body>

			<Stack>
				{study.frames.map((f, i) => (
					<Plate
						key={`${study.slug}-frame-${i}`}
						tone={f.tone}
						ratio={f.ratio}
						src={f.imageUrl || undefined}
						alt={`${study.title} frame ${i + 1}`}
					/>
				))}
			</Stack>

			<Collaborate>
				<div className="ctext">
					<h3>Planning something like this?</h3>
					<p>Tell the studio your date and venue. A proposal follows within 24 hours.</p>
				</div>
				<Button variant="wa" size="lg" href={waLink(serviceWaMessage(study.category))}>
					Inquire — a similar project
				</Button>
			</Collaborate>
		</>
	);
}
