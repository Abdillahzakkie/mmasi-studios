"use client";

import { useEffect } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { serviceWaMessage, waLink } from "@/constants/studio";
import type { Photo } from "@/types";
import {
	Caption,
	Cat,
	Nav,
	SpecList,
	SpecRow,
	Specs,
	Stage,
	StagePlate,
	Title,
	Viewer,
} from "./styled";

interface LightboxProps {
	photos: Photo[];
	index: number;
	onClose: () => void;
	onIndex: (i: number) => void;
}

/**
 * The darkroom viewer: one photograph full on the stage with its technical
 * record beside it, built on the shared Modal (Esc + scrim-click close). Left
 * and right arrows move between photographs, wrapping at the ends.
 */
export default function Lightbox({ photos, index, onClose, onIndex }: LightboxProps) {
	const count = photos.length;
	const photo = photos[index];
	const go = (delta: number) => onIndex((index + delta + count) % count);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") onIndex((index - 1 + count) % count);
			else if (e.key === "ArrowRight") onIndex((index + 1) % count);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [index, count, onIndex]);

	if (!photo) return null;

	return (
		<Modal onClose={onClose} label="Photograph viewer">
			<Viewer>
				<Stage>
					<Nav
						type="button"
						$side="prev"
						aria-label="Previous photograph"
						onClick={() => go(-1)}
					>
						&#8249;
					</Nav>
					<StagePlate
						tone={photo.tone}
						ratio="4/5"
						src={photo.imageUrl || undefined}
						alt={photo.title}
					/>
					<Nav
						type="button"
						$side="next"
						aria-label="Next photograph"
						onClick={() => go(1)}
					>
						&#8250;
					</Nav>
				</Stage>
				<Specs>
					<div>
						<Cat>{photo.category}</Cat>
						<Title>{photo.title}</Title>
					</div>
					<Caption>{photo.caption}</Caption>
					<SpecList>
						<SpecRow>
							<dt>Camera</dt>
							<dd>{photo.camera}</dd>
						</SpecRow>
						<SpecRow>
							<dt>Lens</dt>
							<dd>{photo.lens}</dd>
						</SpecRow>
						<SpecRow>
							<dt>Year</dt>
							<dd>{photo.year}</dd>
						</SpecRow>
						<SpecRow>
							<dt>Location</dt>
							<dd>{photo.location}</dd>
						</SpecRow>
					</SpecList>
					<Button variant="wa" block href={waLink(serviceWaMessage(photo.category))}>
						Inquire for a similar shoot
					</Button>
				</Specs>
			</Viewer>
		</Modal>
	);
}
