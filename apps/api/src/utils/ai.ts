import { env } from "cloudflare:workers";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
	apiKey: env.OPENROUTER_API_KEY,
	headers: {
		"X-Title": "pluto",
	},
});

export const model = openrouter("x-ai/grok-2-1212");
export const evalModel = openrouter("x-ai/grok-3-mini-beta");
export const newsModel = openrouter(
	"perplexity/llama-3.1-sonar-small-128k-online",
);
