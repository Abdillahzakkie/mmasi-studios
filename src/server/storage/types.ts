import "server-only";

export type MediaKind = "image" | "video" | "file";

export interface StorageObject {
	key: string;
	url: string;
	size: number;
	lastModified: string;
	kind: MediaKind;
}

/**
 * The storage contract the app depends on. Every media operation goes through
 * these methods, so the rest of the codebase never knows whether the bytes live
 * in S3/MinIO or ImageKit. `key` is the provider-agnostic identifier, always in
 * `uploads/<name>` form (no leading slash).
 */
export interface StorageProvider {
	publicUrl(key: string): string;
	/** Prepares the backing store (e.g. create the bucket). No-op where unneeded. */
	ensureReady(): Promise<void>;
	upload(
		key: string,
		body: Uint8Array,
		contentType: string,
	): Promise<{ key: string; publicUrl: string }>;
	list(prefix?: string): Promise<StorageObject[]>;
	remove(key: string): Promise<void>;
	exists(key: string): Promise<boolean>;
	copy(srcKey: string, destKey: string): Promise<void>;
	getStream(key: string): Promise<{ body: ReadableStream; contentType: string } | null>;
}

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i;
const VIDEO_EXT = /\.(mp4|mov|webm|m4v|ogv)$/i;

export function kindOf(key: string): MediaKind {
	if (IMAGE_EXT.test(key)) return "image";
	if (VIDEO_EXT.test(key)) return "video";
	return "file";
}
