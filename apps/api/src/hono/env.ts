import type { EnvApi } from "../env";
import type { FeedService } from "../feed/service";
import type { Analytics } from "../utils/analytics";

export type ServiceContext = {
	feed: FeedService;
};

export type HonoEnv = {
	Bindings: EnvApi;
	Variables: {
		services: ServiceContext;
		version: string;
		analytics: Analytics;
	};
};
