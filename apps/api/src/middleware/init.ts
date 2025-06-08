import type { MiddlewareHandler } from "hono";
import { FeedService } from "../feed";
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

		c.set("services", {
			feed: new FeedService({
				waitUntil: c.executionCtx.waitUntil.bind(c.executionCtx),
				userNamespace: c.env.USERDO,
				feedAgentNamespace: c.env.FEED,
			}),
		});

		await next();
	};
}
