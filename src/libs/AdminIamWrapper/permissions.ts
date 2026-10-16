// The friendly builder, UI side. The IAM vocabulary itself (resources, levels,
// the policy-document shape) is shared in @/constants/iam; this file only adds
// how a non-technical owner sees it: one Off / View / Manage row per thing the
// studio owns, and the mapping to and from the stored document.

import { ACCESS, type Access, type PolicyDocument, type Resource } from "@/constants/iam";

const rank = (a: Access) => ACCESS.indexOf(a);

/** Plain-word labels for the three levels, shown on the segmented control. */
export const LEVEL_LABELS: Record<Access, string> = {
	off: "Off",
	read: "View",
	full: "Manage",
};

/**
 * The rows the builder shows — one per thing the studio owns, aligned with the
 * admin nav the owner already knows. "Reels & Films" is one choice that drives
 * both the `reels` and `films` resources, matching the single nav entry.
 */
export interface BuilderRow {
	id: string;
	label: string;
	desc: string;
	resources: Resource[];
}

export const BUILDER_ROWS: BuilderRow[] = [
	{
		id: "portfolio",
		label: "Portfolio",
		desc: "Photographs on the public gallery",
		resources: ["portfolio"],
	},
	{ id: "reels", label: "Reels & Films", desc: "Motion work", resources: ["reels", "films"] },
	{
		id: "casestudies",
		label: "Case studies",
		desc: "Project stories on /work",
		resources: ["casestudies"],
	},
	{ id: "services", label: "Services", desc: "Tiers & pricing", resources: ["services"] },
	{
		id: "content",
		label: "Page content",
		desc: "Headings & copy across the site",
		resources: ["content"],
	},
	{ id: "media", label: "Media library", desc: "Uploaded photos & video", resources: ["media"] },
	{
		id: "inquiries",
		label: "Inquiries",
		desc: "Booking requests from the contact page",
		resources: ["inquiries"],
	},
	{
		id: "settings",
		label: "Settings",
		desc: "Studio profile & contact details",
		resources: ["settings"],
	},
	{
		id: "iam",
		label: "Access & team",
		desc: "Who can sign in and what they can do",
		resources: ["iam"],
	},
];

export type Selections = Record<string, Access>;

/** Reads a stored document into one Off/View/Manage choice per builder row. */
export function selectionsFromDocument(doc: PolicyDocument | undefined): Selections {
	const out: Selections = {};
	for (const row of BUILDER_ROWS) {
		// Divergent resource values (only reachable via Advanced) collapse to the
		// most permissive so the single control stays honest.
		let level: Access = "off";
		for (const r of row.resources) {
			const v = doc?.[r] ?? "off";
			if (rank(v) > rank(level)) level = v;
		}
		out[row.id] = level;
	}
	return out;
}

/** Compiles the builder choices back into a stored document (Off omitted). */
export function documentFromSelections(selections: Selections): PolicyDocument {
	const doc: PolicyDocument = {};
	for (const row of BUILDER_ROWS) {
		const level = selections[row.id] ?? "off";
		if (level === "off") continue;
		for (const r of row.resources) doc[r] = level;
	}
	return doc;
}

/** A one-line, plain-word summary of what a document grants. */
export function summarizeDocument(doc: PolicyDocument): string {
	const sel = selectionsFromDocument(doc);
	const manage = BUILDER_ROWS.filter((r) => sel[r.id] === "full");
	const view = BUILDER_ROWS.filter((r) => sel[r.id] === "read");
	if (manage.length === BUILDER_ROWS.length) return "Everything";
	const parts: string[] = [];
	if (manage.length) parts.push(`Manage ${manage.map((r) => r.label.toLowerCase()).join(", ")}`);
	if (view.length) parts.push(`view ${view.map((r) => r.label.toLowerCase()).join(", ")}`);
	return parts.join("; ") || "No access yet";
}
