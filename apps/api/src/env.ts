import { type StandardSchemaV1, createEnv } from "@t3-oss/env-core";
import type { AgentNamespace } from "agents";
import type { UserDO } from "userdo";
import { z } from "zod";
import type { AgentDO } from "./agents";
import type { FeedAgent } from "./feed";

const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		JWT_SECRET: z.string(),
		OPENROUTER_API_KEY: z.string(),
		VERSION: z.string().default("unknown"),
		FEED: z.custom<AgentNamespace<FeedAgent>>((ns) => typeof ns === "object"),
		USERDO: z.custom<DurableObjectNamespace<UserDO>>(
			(ns) => typeof ns === "object",
		),
		AGENTDO: z.custom<DurableObjectNamespace<AgentDO>>(
			(ns) => typeof ns === "object",
		),
	},
	emptyStringAsUndefined: true,
	runtimeEnv: process.env,
	skipValidation:
		!!process.env.SKIP_ENV_VALIDATION ||
		process.env.npm_lifecycle_event === "lint",
	onValidationError: (issues: readonly StandardSchemaV1.Issue[]) => {
		throw new Error(
			`Invalid environment variables in API: ${JSON.stringify(issues, null, 2)}`,
		);
	},
});

export type EnvApi = typeof env;
