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

export const getWeatherTool = tool({
  description: 'Get the current weather at a location',
  parameters: z.object({
    latitude: z.number().describe("The latitude of the location"),
    longitude: z.number().describe("The longitude of the location"),
  }),
  execute: async ({ latitude, longitude }) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
    );

    const weatherData = await response.json();
    return weatherData;
  },
});

