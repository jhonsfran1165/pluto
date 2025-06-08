import type { UserProfile } from "@agents-arena/types";
import { AgentSchema, CreateAgentSchema } from "@agents-arena/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { authenticated } from "~/utils/auth";
import { USER_DO_KEYS } from "~/utils/constant";
import { Identifier } from "~/utils/identifier";
import type { HonoEnv } from "../hono/env";
import { getAgentDO } from "../utils/do";

const agents = new Hono<HonoEnv>();

agents.post("/create", zValidator("json", CreateAgentSchema), async (c) => {
	const data = c.req.valid("json");
	const { name, personality, prompt, postingFrequency, userId, feed } = data;

	const result = await authenticated(c);

	if (!result.ok) {
		return c.json({ error: result.error }, 401);
	}

	const userDO = result.do;

	try {
		const profile = (await userDO.get(USER_DO_KEYS.PROFILE)) as UserProfile;

		// check if it's the same user
		if (profile.id !== userId) {
			return c.json(
				{ error: "You are not authorized to create an agent for this user" },
				401,
			);
		}

		// create the agent object
		const agent = {
			id: Identifier.create("agent"),
			name,
			personality,
			prompt,
			postingFrequency,
			createdAt: Date.now(),
			userId,
			feed,
			updatedAt: Date.now(),
		};

		// update user profile with the new agent
		await userDO.set(USER_DO_KEYS.PROFILE, {
			...profile,
			agents: [...profile.agents, agent],
		});

		// create the agent
		const agentDO = getAgentDO(agent.id);

		// this can take a while lets do it in the background
		c.executionCtx.waitUntil(
			agentDO.create({
				...agent,
				feed: feed,
				memory: {
					ownPostStats: [],
					trendingPatterns: [],
				},
				isActive: true,
			}),
		);

		return c.json({ message: "Agent created successfully", agent }, 200);
	} catch (e: unknown) {
		if (e instanceof Error) {
			return c.json({ error: e.message }, 400);
		}
		return c.json({ error: "Agent creation error" }, 400);
	}
});

agents.post("/update", zValidator("json", AgentSchema.pick(
	{ id: true, name: true, personality: true, prompt: true, postingFrequency: true, userId: true })), async (c) => {
	const data = c.req.valid("json");
	const { id, name, personality, prompt, postingFrequency, userId } = data;

	const result = await authenticated(c);

	if (!result.ok) {
		return c.json({ error: result.error }, 401);
	}

	const userDO = result.do;

	try {
		const profile = (await userDO.get(USER_DO_KEYS.PROFILE)) as UserProfile;

		// check if it's the same user
		if (profile.id !== userId) {
			return c.json(
				{ error: "You are not authorized to create an agent for this user" },
				401,
			);
		}

		// find the agent
		const agent = profile.agents.find((agent) => agent.id === id);

		if (!agent) {
			return c.json({ error: "Agent not found" }, 404);
		}

		// create the agent object
		const updatedAgent = {
			...agent,
			name,
			personality,
			prompt,
			postingFrequency,
			updatedAt: Date.now(),
		};

		// update user profile with the new agent
		await userDO.set(USER_DO_KEYS.PROFILE, {
			...profile,
			agents: profile.agents.map((agent) => agent.id === id ? updatedAgent : agent),
		});

		// update the agent
		const agentDO = getAgentDO(id);

		// this can take a while lets do it in the background
		c.executionCtx.waitUntil(
			agentDO.update(updatedAgent),
		);

		return c.json({ message: "Agent updated successfully", agent }, 200);
	} catch (e: unknown) {
		if (e instanceof Error) {
			return c.json({ error: e.message }, 400);
		}
		return c.json({ error: "Agent creation error" }, 400);
	}
});

agents.post(
	"/delete",
	zValidator(
		"json",
		z.object({
			agentId: z.string(),
		}),
	),
	async (c) => {
		const data = c.req.valid("json");
		const { agentId } = data;

		const result = await authenticated(c);

		if (!result.ok) {
			return c.json({ error: result.error }, 401);
		}

		const userDO = result.do;

		try {
			const profile = (await userDO.get(USER_DO_KEYS.PROFILE)) as UserProfile;

			// filter the agents
			const agents = profile.agents.filter((agent) => agent.id !== agentId);

			// update the user profile
			await userDO.set(USER_DO_KEYS.PROFILE, {
				...profile,
				agents,
			});

			// delete the agent
			const agentDO = getAgentDO(agentId);
			// this can take a while lets do it in the background
			c.executionCtx.waitUntil(
				agentDO.delete(),
			);

			return c.json({ message: "Agent deleted successfully" }, 200);
		} catch (e: unknown) {
			if (e instanceof Error) {
				return c.json({ error: e.message }, 400);
			}
			return c.json({ error: "Agent deletion error" }, 400);
		}
	},
);

export default agents;
