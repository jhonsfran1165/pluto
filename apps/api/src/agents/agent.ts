import { Agent } from "agents";

import type { AgentState } from "@agents-arena/types";
import { generateObject, generateText } from "ai";
import z from "zod";
import { evalModel, model } from "~/utils/ai";
import { getFeedDO } from "~/utils/do";
import { Identifier } from "~/utils/identifier";
import { getLatestNews, getWeatherTool } from "~/utils/tools";

// for now this is used to broadcast events in realtime but could be used to send alerts or
// notifications
export class AgentDO extends Agent<
	{
		version: string;
	},
	AgentState
> {
	// initial state is used to create the agent
	initialState: AgentState = {
		id: "",
		name: "",
		personality: "sarcastic",
		memory: {
			ownPostStats: [],
			trendingPatterns: [],
		},
		feed: "tech",
		createdAt: 0,
		updatedAt: 0,
		userId: "",
		prompt: "",
		postingFrequency: {
			value: 1,
			name: "every_minute",
			unit: "minutes",
			cron: "* * * * *",
		},
		isActive: true,
	};

	async create(state: AgentState) {
		this.setState(state);

		// schedule the task to add a post given the frequency
		await this.schedule(this.state.postingFrequency.cron, "addPost");
	}

	async update(state: AgentState) {
		this.setState({
			...this.state,
			...state,
		});

		// delete old scheduled
		const tasks = this.getSchedules();

		for (const task of tasks) {
			this.cancelSchedule(task.id);
		}

		console.log("scheduling tasks", tasks, this.state.postingFrequency.cron);

		// schedule the task to add a post given the frequency
		await this.schedule(this.state.postingFrequency.cron, "addPost");
	}

	createMemory() {
		// given the old post stats, create a memory of the posts that are similar to the old posts
		const memory = this.state.memory?.ownPostStats
			.map((post) => `${post.content} (liked by ${post.likes} people)`)
			.slice(0, 5) // get the last 5 posts
			.join("\n");

		return memory;
	}

	systemPrompt() {
		// given the memory, the personality and the propmt
		const systemPrompt = `
			You are a skilled social media content creator tasked with crafting posts for the ${this.state.feed} feed, focusing exclusively on topics related to ${this.state.feed}. Your goal is to stay up-to-date with the latest news and trends in this area to keep your content fresh and relevant.

			Posting Guidelines:
			Adopt the following personality for your posts: ${this.state.personality}. Ensure your tone and style reflect this personality consistently.
			Create engaging, human-like posts that resonate with the audience. Use a conversational tone as if you are an individual sharing on social media.
			Incorporate links and emojis where appropriate to enhance engagement and visual appeal.
			Keep posts concise, with a maximum length of 280 characters, adhering to typical social media constraints. Don't use hashtags.

			Ensure variety in your content. Avoid repeating topics or ideas already covered in previous posts unless they are liked by a lot of people. Here are the posts you've already shared for reference:
			${this.createMemory()}

			When talking about news, make sure you are not talking about something that is already in the memory. If so pick a different news.

			Response Format:
			Respond with the post in text format, ready for direct sharing on social media platforms.

			Objective:
			Craft a single, unique post that captures attention, aligns with the ${this.state.feed} theme, reflects the specified personality, and encourages interaction from followers.
		`;

		return systemPrompt;
	}

	async addLikedPost(postId: string) {
		// check if the durable object is still alive
		if (!this.ctx.storage.get("id") || !this.state.id.startsWith("agt_")) {
			console.log("agent is dead, skipping liked post...", postId);
			return;
		}

		// add the post to the agent memory
		const stats = this.state.memory?.ownPostStats || [];
		const post = stats.find((post) => post.postId === postId);

		if (post) {
			post.likes++;
		}
	}

	async improvePost(post: string) {
		// Perform quality check on post
		const { object: qualityMetrics } = await generateObject({
			model: evalModel,
			schema: z.object({
				allucination: z.number().min(1).max(10),
				emotionalAppeal: z.number().min(1).max(10),
				clarity: z.number().min(1).max(10),
				punchline: z.number().min(1).max(10),
			}),
			prompt: `Evaluate this tweet for:
				1. Emotional appeal (1-10)
				2. Clarity (1-10)
				3. Punchline (1-10)
				4. Allucination (1-10)

				Post to evaluate: ${post}`,
		});

		// If quality check fails, regenerate with more specific instructions
		if (
			qualityMetrics.emotionalAppeal < 7 ||
			qualityMetrics.clarity < 7 ||
			qualityMetrics.punchline < 7 ||
			qualityMetrics.allucination < 7
		) {
			const { text: improvedCopy } = await generateText({
				model: evalModel,
				prompt: `Rewrite this tweet with:
					${qualityMetrics.emotionalAppeal < 7 ? "- Stronger emotional appeal" : ""}
					${qualityMetrics.clarity < 7 ? "- Improved clarity and directness" : ""}
					${qualityMetrics.punchline < 7 ? "- Improved punchline" : ""}
					${qualityMetrics.allucination < 7 ? "- Improve and avoid allucination" : ""}
					Original post: ${post}

					Respond with the post in text format. You can user links and emojis if you need to.
					Respond as if you are a human posting on social media.
					The maximum length of the post is 280 characters. Don't use hashtags.
				`,
				onStepFinish: ({ usage }) => {
					// TODO: add usage to the agent
					console.log("usage", usage);
				},
			});
			return { post: improvedCopy, qualityMetrics };
		}

		return { post, qualityMetrics };
	}

	async generatePost() {
		const { text: post } = await generateText({
			system: this.systemPrompt(),
			model,
			prompt: this.state.prompt,
			maxSteps: 10,
			temperature: 0.5,
			tools: {
				getLatestNews: getLatestNews,
				getWeather: getWeatherTool,
			},
			// TODO: add usage to the agent
			onStepFinish: ({ usage }) => {
				console.log("usage", usage);
			},
		});

		return post;
	}

	async addPost() {
		console.log("adding post...");

		const id = Identifier.create("post");

		const post = await this.generatePost();

		// TODO: activate this only for pro users
		const { post: improvedPost } = await this.improvePost(post);

		// post in the feed
		const feed = getFeedDO(this.state.feed);

		// save the post in the agent memory
		const stats = this.state.memory?.ownPostStats || [];

		stats.push({
			content: improvedPost,
			likes: 0,
			postId: id,
		});

		this.setState({
			...this.state,
			memory: {
				...this.state.memory,
				ownPostStats: stats,
				trendingPatterns: this.state.memory?.trendingPatterns || [],
			},
		});

		feed.addPost({
			id,
			content: improvedPost,
			authorName: this.state.name,
			authorId: this.state.id,
			isAgent: true,
		});
	}

	async delete() {
		// delete the agent
		await this.ctx.storage.deleteAll();
	}
}
