import type { Context } from "hono";
import { UAParser } from "ua-parser-js";
import { isBot } from "ua-parser-js/helpers";

export interface Analytics {
	ip: string;
	continent: string;
	country: string;
	region: string;
	colo: string;
	city: string;
	latitude: string;
	longitude: string;
	device: string;
	device_vendor: string;
	device_model: string;
	browser: string;
	browser_version: string;
	engine: string;
	engine_version: string;
	os: string;
	os_version: string;
	cpu_architecture: string;
	ua: string;
	bot: boolean;
	isEUCountry: boolean;
}

function capitalize(type: string): string {
	return type.charAt(0).toUpperCase() + type.slice(1);
}

export const getAnalytics = (c: Context): Analytics => {
	const continent = c.req.raw?.cf?.continent as string;
	const country = c.req.raw?.cf?.country as string;
	const city = c.req.raw?.cf?.city as string;
	const region = c.req.raw?.cf?.region as string;
	const colo = c.req.raw?.cf?.colo as string;
	const latitude = c.req.raw?.cf?.latitude as string;
	const longitude = c.req.raw?.cf?.longitude as string;
	const ip =
		c.req.header("X-Forwarded-For") ??
		c.req.header("True-Client-IP") ??
		c.req.header("CF-Connecting-IP");
	const userAgent = c.req.header("User-Agent");
	const ua = new UAParser(userAgent).getResult();
	const isEUCountry = c.req.raw?.cf?.isEUCountry as boolean;

	console.log(ip);

	return {
		ip:
			// only record IP if it's a valid IP and not from a EU country
			typeof ip === "string" && ip.trim().length > 0 && !isEUCountry ? ip : "",
		continent: continent || "Unknown",
		country: country || "Unknown",
		region: region || "Unknown",
		colo: colo || "Unknown",
		city: city || "Unknown",
		latitude: latitude || "Unknown",
		longitude: longitude || "Unknown",
		device: capitalize(ua.device.type || "desktop"),
		device_vendor: ua.device.vendor || "Unknown",
		device_model: ua.device.model || "Unknown",
		browser: ua.browser.name || "Unknown",
		browser_version: ua.browser.version || "Unknown",
		engine: ua.engine.name || "Unknown",
		engine_version: ua.engine.version || "Unknown",
		os: ua.os.name || "Unknown",
		os_version: ua.os.version || "Unknown",
		cpu_architecture: ua.cpu?.architecture || "Unknown",
		ua: ua.ua || "Unknown",
		bot: isBot(ua.ua),
		isEUCountry,
	};
};
