import { generateText, tool } from "ai";
import { z } from "zod";
import { newsModel } from "./ai";

export async function getNews(topic: string) {
	try {
		const { text } = await generateText({
			model: newsModel,
			system: `
        You are a news reporter.
        You are given a topic and you need to give me the latest news about it.
        You need to give me the latest news about it.
      `,
			prompt: `give me the latest news about ${topic}`,
		});

		return text;
	} catch (error) {
		return "Error getting news";
	}
}

export const getLatestNews = tool({
	description: "Search for the latest news with sources about a topic",
	parameters: z.object({
		topic: z.string().describe("The topic to search for"),
	}),
	execute: async ({ topic }) => {
		const news = await getNews(topic);
		return news;
	},
});
