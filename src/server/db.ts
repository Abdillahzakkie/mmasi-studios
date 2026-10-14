import "server-only";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error("MONGODB_URI is not set. Copy .env.example to .env.local.");
}

// Cache the connection across hot reloads in dev and across lambda invocations,
// so a new connection is not opened on every request.
interface Cached {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}
const globalForMongoose = globalThis as unknown as { _mongoose?: Cached };
const cached: Cached = globalForMongoose._mongoose ?? { conn: null, promise: null };
globalForMongoose._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI as string, {
			bufferCommands: false,
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}
