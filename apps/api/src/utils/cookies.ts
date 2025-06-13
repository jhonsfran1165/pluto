import { env } from "cloudflare:workers";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

export function setCookiesAuth({
	c,
	name,
	value,
}: {
	c: Context;
	name: string;
	value: string;
}) {
	// we could sign the cookie with a secret key to prevent tampering
	// but we don't need to for now
	setCookie(c, name, value, {
		httpOnly: c.env.NODE_ENV === "production",
		secure: c.env.NODE_ENV === "production",
		path: "/",
		sameSite: c.env.NODE_ENV === "production" ? "None" : "Lax", // frontend can access the cookie
		// let's set expiration 30 days from now in UTC
		maxAge: 60 * 60 * 24 * 30,
		prefix: c.env.NODE_ENV === "production" ? "secure" : undefined,
	});
}

function getCookieName(name: string) {
	// @ts-expect-error cloudflare is great -.-
	const isCookieSecure = env.NODE_ENV === "production";
	const cookiePrefix = isCookieSecure ? "__Secure" : "";
	return `${cookiePrefix}-${name}`;
}

export function getCookiesAuth({
	c,
	name,
}: {
	c: Context;
	name: string;
}) {
	return getCookie(
		c,
		getCookieName(name),
		c.env.NODE_ENV === "production" ? "secure" : undefined,
	);
}

export function getCookiesAuthFromRequest(req: Request, name: string) {
	const cookies = req.headers.get("Cookie");
	const value = cookies
		?.split(";")
		.find((cookie) => cookie.trim().startsWith(`${getCookieName(name)}=`));

	if (!value) {
		return null;
	}

	return value.split("=")[1];
}

export function replaceHeaderCookie(
	headers: Headers,
	name: string,
	value: string,
) {
	const cookies = headers.get("Cookie");
	const cookie = cookies
		?.split(";")
		.find((cookie) => cookie.trim().startsWith(`${getCookieName(name)}=`));

	if (!cookie) {
		return null;
	}

	const newCookie = `${cookie.split("=")[0]}=${value}; ${cookie.split(";")[1]}`;

	return newCookie;
}
