"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseButton, Scrim } from "./styled";

interface ModalProps {
	onClose: () => void;
	children: React.ReactNode;
	/** Omit the default close button when the content provides its own. */
	hideClose?: boolean;
	label?: string;
}

/**
 * Portals its children over the page into #modal-root, locks body scroll, and
 * closes on Escape or a scrim click. Used by the lightbox, the video player and
 * the admin dialogs.
 */
export default function Modal({ onClose, children, hideClose, label }: ModalProps) {
	const [root, setRoot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setRoot(document.getElementById("modal-root"));
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
		};
	}, [onClose]);

	if (!root) return null;

	return createPortal(
		<Scrim
			role="dialog"
			aria-modal="true"
			aria-label={label}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			{!hideClose && (
				<CloseButton type="button" aria-label="Close" onClick={onClose}>
					&times;
				</CloseButton>
			)}
			{children}
		</Scrim>,
		root,
	);
}

export { Dialog } from "./styled";
