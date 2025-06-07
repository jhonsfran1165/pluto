import { FeedSchema } from "@agents-arena/types";
import { agentsMiddleware } from "hono-agents";
import type { EnvApi } from "./env";
import { newApp } from "./hono/app";
import agents from "./routes/agents";
import auth from "./routes/auth";
import { getEmailFromToken } from "./utils/auth";
import { getCookiesAuthFromRequest } from "./utils/cookies";
import { getUserDO } from "./utils/do";

// handle feed agent
export { FeedAgent } from "./feed";
// handle agent Durable Objects
export { AgentDO } from "./agents";
// handle auth Durable Objects
export { UserDO } from "userdo";

// init app
const app = newApp();

// Handle websocket connections for Durable Objects
app.use(
	"*",
	agentsMiddleware({
		onError: (error) => console.error(error),
		options: {
			prefix: "agents",
			onBeforeRequest: () => {
				// can't access the agent namespace directly
				return new Response("Unauthorized", { status: 401 });
			},
			onBeforeConnect: async (req, params) => {
				// valid feeds for now
				const validFeed = FeedSchema.safeParse(params.name);

				if (!validFeed.success) {
					return new Response("Unauthorized", { status: 401 });
				}

				const party = params.party as string;

				// only allow websokcet connection to certain namespaces
				if (party !== "feed") {
					return new Response("Unauthorized", { status: 401 });
				}

				// validate token
				const token = getCookiesAuthFromRequest(req, "token");
				const refreshToken = getCookiesAuthFromRequest(req, "refreshToken");

				if (!token || !refreshToken) {
					// respond with a 401 and let the frontend handle the refresh
					return new Response("Unauthorized", { status: 401 });
				}

				// verify token
				try {
					const { email, exp } = getEmailFromToken(token, refreshToken);

					// validate exp
					if (email && exp < Date.now() / 1000) {
						// get userDO
						const userDO = getUserDO(email);

						// verify the token
						const result = await userDO.verifyToken({ token: token });

						if (!result.ok) {
							// respond with a 401 and let the frontend handle the refresh
							return new Response("Expired token", { status: 401 });
						}
					}
				} catch (e) {
					// respond with a 401 and let the frontend handle the refresh
					return new Response(e instanceof Error ? e.message : "Unauthorized", {
						status: 401,
					});
				}
			},
		},
	}),
);

// Mount auth routes
app.route("/api/v1/auth", auth);

// Mount agents routes
app.route("/api/v1/agents", agents);

// Export handler
const handler = {
	fetch: (req: Request, env: EnvApi, executionCtx: ExecutionContext) => {
		return app.fetch(req, env, executionCtx);
	},
} satisfies ExportedHandler<EnvApi>;

export default handler;
