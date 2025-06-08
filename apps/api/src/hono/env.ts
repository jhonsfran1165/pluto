import type { EnvApi } from "../env";
import type { Analytics } from "../utils/analytics";

export type HonoEnv = {
	Bindings: EnvApi;
	Variables: {
		version: string;
		analytics: Analytics;
	};
};
