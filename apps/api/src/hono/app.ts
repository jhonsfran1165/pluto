
import type { Context as GenericContext } from "hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { init } from "../middleware/init";
import type { HonoEnv } from "./env";

export function newApp() {
	const app = new Hono<HonoEnv>();

	app.use(prettyJSON());

	app.use(
		"*",
		cors({
			origin: [
				"http://localhost:3001",
				"https://pluto-web-five.vercel.app",
				"https://*.pluto-web-five.vercel.app",
			],
			allowHeaders: ["*"],
			allowMethods: ["*"],
			credentials: true,
			exposeHeaders: ["*"],
			maxAge: 1000 * 60 * 60 * 24, // 24 hours
		}),
	);

	app.use("*", init());

	return app;
}

export type App = ReturnType<typeof newApp>;
export type Context = GenericContext<HonoEnv>;
