import type { Context as GenericContext } from "hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { env } from "~/env";
import { init } from "../middleware/init";
import type { HonoEnv } from "./env";

export function newApp() {
	const app = new Hono<HonoEnv>();

	app.use(prettyJSON());

	app.use(
		"*",
		cors({
			origin: env.FRONTEND_URL,
			allowHeaders: ["Content-Type", "Authorization"],
			allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			exposeHeaders: ["*"],
			credentials: true,
			maxAge: 1000 * 60 * 60 * 24, // 24 hours
		}),
	);

	app.use("*", init());

	return app;
}

export type App = ReturnType<typeof newApp>;
export type Context = GenericContext<HonoEnv>;
