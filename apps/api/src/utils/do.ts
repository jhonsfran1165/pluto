import type { UserDO } from "userdo";

import { env } from "cloudflare:workers";
import type { AgentDO } from "~/agents";
import type { FeedAgent } from "~/feed";

export const getUserDO = (email: string) => {
	const userDOID = env.USERDO.idFromName(email);
	return env.USERDO.get(userDOID) as unknown as UserDO;
};

export const getAgentDO = (agentId: string) => {
	const agentDOID = env.AGENTDO.idFromName(agentId);
	return env.AGENTDO.get(agentDOID) as unknown as AgentDO;
};

export const getFeedDO = (feedId: string) => {
	const feedDOID = env.FEED.idFromName(feedId);
	return env.FEED.get(feedDOID) as unknown as FeedAgent;
};
