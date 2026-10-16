/**
 * The IAM vocabulary, right-sized for mmasi: a flat resource→level map, no AWS
 * ARNs or statement engine. Pure and isomorphic — safe to import from client UI
 * and the server alike. The server-only parts (effective perms, enforcement)
 * live in `@/server/iam`.
 */

/** The admin sections access can be granted on. */
export const RESOURCES = [
	"portfolio",
	"reels",
	"films",
	"casestudies",
	"services",
	"content",
	"media",
	"inquiries",
	"settings",
	"iam",
] as const;

export type Resource = (typeof RESOURCES)[number];

/** Access levels, least to most permissive. */
export const ACCESS = ["off", "read", "full"] as const;
export type Access = (typeof ACCESS)[number];

const RANK: Record<Access, number> = { off: 0, read: 1, full: 2 };

/**
 * A policy grant map. A resource maps to "read" or "full"; an omitted resource
 * means "off". Maps 1:1 to the Off/Read/Full builder and is always reversible.
 */
export type PolicyDocument = Partial<Record<Resource, Exclude<Access, "off">>>;

/** A fully-resolved permission set: every resource present. */
export type Permissions = Record<Resource, Access>;

/** A permission set with every resource at "off". */
export function emptyPermissions(): Permissions {
	return Object.fromEntries(RESOURCES.map((r) => [r, "off"])) as Permissions;
}

/** True when the granted level on `resource` meets or exceeds `need`. */
export function can(perms: Permissions, resource: Resource, need: Access): boolean {
	return RANK[perms[resource] ?? "off"] >= RANK[need];
}

/** Merge policy documents, taking the most permissive grant per resource. */
export function mergeDocuments(docs: PolicyDocument[]): Permissions {
	const out = emptyPermissions();
	for (const doc of docs) {
		if (!doc) continue;
		for (const r of RESOURCES) {
			const grant = doc[r];
			if (grant && RANK[grant] > RANK[out[r]]) out[r] = grant;
		}
	}
	return out;
}

/** Validates untrusted input as a PolicyDocument (known resources → read|full). */
export function isValidDocument(input: unknown): input is PolicyDocument {
	if (!input || typeof input !== "object" || Array.isArray(input)) return false;
	for (const [key, value] of Object.entries(input)) {
		if (!RESOURCES.includes(key as Resource)) return false;
		if (value !== "read" && value !== "full") return false;
	}
	return true;
}
