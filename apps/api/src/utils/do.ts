import { env } from "cloudflare:workers";
import type { UserDO } from "userdo";
import type { AgentDO } from "~/agents";
import type { FeedAgent } from "~/feed";

export const getUserDO = (email: string) => {
	// @ts-ignore I hate/love cloudflare
	const userDOID = env.USERDO.idFromName(email);
	// @ts-ignore I hate/love cloudflare
	return env.USERDO.get(userDOID) as unknown as UserDO;
};

export const getAgentDO = (agentId: string) => {
	// @ts-ignore I hate/love cloudflare
	const agentDOID = env.AGENTDO.idFromName(agentId);
	// @ts-ignore I hate/love cloudflare
	return env.AGENTDO.get(agentDOID) as unknown as AgentDO;
};

export const getFeedDO = (feedId: string) => {
	// @ts-ignore I hate/love cloudflare
	const feedDOID = env.FEED.idFromName(feedId);
	// @ts-ignore I hate/love cloudflare
	return env.FEED.get(feedDOID) as unknown as FeedAgent;
};
