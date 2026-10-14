"use client";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Plate from "@/components/Plate";
import { serviceWaMessage, waLink } from "@/constants/studio";
import type { Tone } from "@/types";
import { Controls, Frame, Play, Player, PMeta, Scrub, Stage } from "./styled";

export interface VideoItem {
	title: string;
	category: string;
	tone: Tone;
	duration: string;
	resolution?: string;
	format: "reel" | "cinema";
}

interface VideoPlayerProps {
	item: VideoItem;
	onClose: () => void;
}

/**
 * A themed player that opens over the page below the persistent header. The
 * stage matches the item's format — 16/9 for a cinema film, 9/16 for a reel —
 * and the footer carries the title, its spec line and a WhatsApp inquiry scoped
 * to the piece's category. Playback controls are presentational until a real
 * video source is wired, so they are hidden from assistive technology.
 */
export default function VideoPlayer({ item, onClose }: VideoPlayerProps) {
	const { title, category, tone, duration, resolution, format } = item;
	const kind = format === "reel" ? "reel" : "film";
	const spec = resolution ?? (format === "reel" ? "9:16" : "16:9");

	return (
		<Modal onClose={onClose} label="Video player">
			<Player>
				<Stage>
					<Frame $format={format}>
						<Plate tone={tone} />
						<Play aria-hidden />
					</Frame>
				</Stage>
				<Controls aria-hidden>
					<span className="glyph">&#10073;&#10073;</span>
					<Scrub />
					<span className="time">{duration}</span>
					<span className="glyph">&#128266;</span>
				</Controls>
				<PMeta>
					<div className="mtext">
						<b>{title}</b>
						<span>
							{category} &middot; {spec} &middot; {duration}
						</span>
					</div>
					<Button variant="wa" href={waLink(serviceWaMessage(category))} className="inq">
						Inquire about a {category.toLowerCase()} {kind}
					</Button>
				</PMeta>
			</Player>
		</Modal>
	);
}
