import { type StandardSchemaV1, createEnv } from "@t3-oss/env-core";
import type { UserDO } from "userdo";
import { z } from "zod";
import type { AgentDO } from "./agents";
import type { FeedAgent } from "./feed";

export const cloudflareRatelimiter = z.custom<{
	limit: (opts: { key: string }) => Promise<{ success: boolean }>;
}>((r) => !!r && typeof r.limit === "function");


export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		JWT_SECRET: z.string(),
		FRONTEND_URL: z.string().url().default("http://localhost:3001"),
		OPENROUTER_API_KEY: z.string(),
		VERSION: z.string().default("unknown"),
		FEED: z.custom<DurableObjectNamespace<FeedAgent>>(
			(ns) => typeof ns === "object",
		),
		USERDO: z.custom<DurableObjectNamespace<UserDO>>(
			(ns) => typeof ns === "object",
		),
		AGENTDO: z.custom<DurableObjectNamespace<AgentDO>>(
			(ns) => typeof ns === "object",
		),
		RL_FREE_100_60s: cloudflareRatelimiter,
	},
	emptyStringAsUndefined: true,
	runtimeEnv: process.env,
	skipValidation: true, // TODO: remove this
	onValidationError: (issues: readonly StandardSchemaV1.Issue[]) => {
		throw new Error(
			`Invalid environment variables in API: ${JSON.stringify(issues, null, 2)}`,
		);
	},
});

export type EnvApi = typeof env;
