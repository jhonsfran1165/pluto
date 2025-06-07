import type { AgentNamespace } from "agents";
import type { UserDO } from "userdo";
import type { FeedAgent } from "./agent";
import type { GetFeedRequest, GetFeedResponse } from "./interface";

export class FeedService {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private readonly waitUntil: (promise: Promise<any>) => void;
	private readonly userNamespace: DurableObjectNamespace<UserDO>;
	private readonly feedAgentNamespace: AgentNamespace<FeedAgent>;

	constructor(opts: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		waitUntil: (promise: Promise<any>) => void;
		userNamespace: DurableObjectNamespace<UserDO>;
		feedAgentNamespace: AgentNamespace<FeedAgent>;
	}) {
		this.waitUntil = opts.waitUntil;
		this.userNamespace = opts.userNamespace;
		this.feedAgentNamespace = opts.feedAgentNamespace;
	}
}
