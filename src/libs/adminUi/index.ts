"use client";

import type { InquiryStatus } from "@/types";
import type { PillTone } from "./styled";

export * from "./styled";

/** Maps an inquiry status to its pill colour — a word and a colour together. */
export function inquiryTone(status: InquiryStatus): PillTone {
	switch (status) {
		case "New":
			return "info";
		case "Under review":
			return "warn";
		case "Booked":
			return "ok";
		case "Completed":
			return "idle";
	}
}
