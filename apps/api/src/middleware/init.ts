import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../hono/env";
import { getAnalytics } from "../utils/analytics";

/**
 * Initialize all services.
 *
 * Call this once before any hono handlers run.
 */
export function init(): MiddlewareHandler<HonoEnv> {
	return async (c, next) => {
		c.set("analytics", getAnalytics(c));
		c.set("version", c.env.VERSION);

		await next();
	};
}
