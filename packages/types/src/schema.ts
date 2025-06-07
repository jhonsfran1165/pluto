import { z } from "zod";

export const FeedSchema = z.enum([
	"tech",
	"science",
	"politics",
	"entertainment",
	"sports",
]);

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export const PersonalitySchema = z.enum([
	"sarcastic",
	"funny",
	"serious",
	"witty",
	"philosophical",
	"inspirational",
	"motivational",
	"meme",
]);

export const postingFrequencies = [
	{
		value: 30,
		name: "every_30_seconds",
		unit: "seconds",
		cron: "*/30 * * * * *",
	},
	{
		value: 1,
		name: "every_minute",
		unit: "minutes",
		cron: "* * * * *",
	},
	{
		value: 5,
		name: "every_5_minutes",
		unit: "minutes",
		cron: "*/5 * * * *",
	},
	{
		value: 10,
		name: "every_10_minutes",
		unit: "minutes",
		cron: "*/10 * * * *",
	},
] as const;

export const PostingFrequencyEnum = z.union([
	z.object({
		value: z.literal(30),
		name: z.literal("every_30_seconds"),
		unit: z.literal("seconds"),
		cron: z.literal("*/30 * * * * *"),
	}),
	z.object({
		value: z.literal(1),
		name: z.literal("every_minute"),
		unit: z.literal("minutes"),
		cron: z.literal("* * * * *"),
	}),
	z.object({
		value: z.literal(5),
		name: z.literal("every_5_minutes"),
		unit: z.literal("minutes"),
		cron: z.literal("*/5 * * * *"),
	}),
	z.object({
		value: z.literal(10),
		name: z.literal("every_10_minutes"),
		unit: z.literal("minutes"),
		cron: z.literal("*/10 * * * *"),
	}),
]);

export const PostSchema = z.object({
	id: z.string(),
	content: z
		.string()
		.min(10, "Content must be at least 10 characters")
		.transform((value) => value.trim()),
	authorId: z.string(),
	timestamp: z.number(),
	likes: z.number(),
	likedBy: z.array(z.string()),
	isAgent: z.boolean().optional(),
});

export const MemorySchema = z.object({
	likedPosts: z
		.object({
			postId: z.string(),
			likes: z.number(),
			content: z.string(),
		})
		.array(),
	ownPostStats: z
		.object({
			postId: z.string(),
			likes: z.number(),
			content: z
				.string()
				.min(10, "Content must be at least 10 characters")
				.transform((value) => value.trim()),
		})
		.array(),
	trendingPatterns: z.array(z.string()),
});

export const AgentSchema = z.object({
	id: z.string(),
	name: z.string().min(2, "Name must be at least 2 characters"),
	personality: PersonalitySchema,
	prompt: z
		.string()
		.min(10, "Prompt must be at least 10 characters")
		.transform((value) => value.trim()),
	postingFrequency: PostingFrequencyEnum,
	userId: z.string().min(2, "User ID must be at least 2 characters"),
	createdAt: z.number(),
	updatedAt: z.number(),
	isActive: z.boolean().default(true),
	feed: FeedSchema,
	memory: MemorySchema.optional(),
});

export const CreateAgentSchema = AgentSchema.pick({
	name: true,
	personality: true,
	prompt: true,
	postingFrequency: true,
	userId: true,
	feed: true,
});

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	createdAt: z.number(),
	password: z.string().min(8, "Password must be at least 8 characters"),
	type: z.enum(["default", "premium", "admin"]),
	agents: z.array(
		AgentSchema.pick({
			id: true,
			name: true,
			personality: true,
			postingFrequency: true,
			feed: true,
		}),
	),
});
