"use client";

import { useState } from "react";
import { Button, Modal } from "@/components";
import { STUDIO, waLink } from "@/constants/studio";
import { Body, CopyRow, Foot, Head, LightDialog } from "./styled";

interface ShareDialogProps {
	title: string;
	slug: string;
	onClose: () => void;
}

/**
 * Shares one piece in one place: a WhatsApp send that opens the chat with the
 * public link pre-composed, and a copy-link row with a visual confirmation.
 */
export default function ShareDialog({ title, slug, onClose }: ShareDialogProps) {
	const [copied, setCopied] = useState(false);
	const url = `https://mmasiejikeme.studio/work/${slug}`;
	const message = `Hi, here's a piece from ${STUDIO.name} — "${title}": ${url}`;

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2400);
		} catch {
			setCopied(false);
		}
	};

	return (
		<Modal hideClose onClose={onClose} label={`Share ${title}`}>
			<LightDialog>
				<Head>
					<h3>Share “{title}”</h3>
					<p>
						Send it straight to a client, or copy a link that opens this exact piece
						with the studio navigation still in reach.
					</p>
				</Head>
				<Body>
					<Button variant="wa" block href={waLink(message)}>
						Send on WhatsApp
					</Button>
					<CopyRow>
						<input readOnly value={url} aria-label="Share link" />
						<button type="button" onClick={copy}>
							Copy
						</button>
					</CopyRow>
					{copied && <span className="copied">Link copied</span>}
				</Body>
				<Foot>
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
				</Foot>
			</LightDialog>
		</Modal>
	);
}
