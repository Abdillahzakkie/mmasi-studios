import { jwtVerify, SignJWT } from "jose";

// Edge-safe (jose, no native deps) so the middleware can verify sessions.
export const SESSION_COOKIE = "mmasi_session";

const secret = () => {
	const s = process.env.JWT_SECRET;
	if (!s) throw new Error("JWT_SECRET is not set.");
	return new TextEncoder().encode(s);
};

export interface SessionPayload {
	sub: string;
	email: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
	return new SignJWT({ email: payload.email })
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(payload.sub)
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(secret());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
	if (!token) return null;
	try {
		const { payload } = await jwtVerify(token, secret());
		return { sub: String(payload.sub), email: String(payload.email) };
	} catch {
		return null;
	}
}
