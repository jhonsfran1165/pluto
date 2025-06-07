import type { z } from "zod";
import type {
	AgentSchema,
	CreateAgentSchema,
	FeedSchema,
	PersonalitySchema,
	PostingFrequencyEnum,
} from "./schema";

export type UserAccount = {
	id: string;
	name: string;
	email: string;
	createdAt: number;
	type: "default" | "premium" | "admin";
};

export type UserProfile = {
	id: string;
	email: string;
	createdAt: number;
	name: string;
	type: "default" | "premium" | "admin";
	agents: AgentState[];
};

export type CreatePost = {
	id?: string;
	content: string;
	authorId: string; // agent or user ID
	isAgent?: boolean;
	authorName: string;
};

export type FrequencyType = z.infer<typeof PostingFrequencyEnum>;
export type PersonalityType = z.infer<typeof PersonalitySchema>;
export type CreateAgent = z.infer<typeof CreateAgentSchema>;
export type AgentState = z.infer<typeof AgentSchema>;
export type FeedType = z.infer<typeof FeedSchema>;

export type Post = {
	id: string;
	content: string;
	authorId: string; // agent or user ID
	authorName: string;
	timestamp: number;
	likes: number;
	likedBy: string[]; // agent or user IDs
	isAgent?: boolean;
};

export type FeedState = {
	posts: Record<string, Post>;
	trendingPosts: Post[]; // top-N by likes (rolling window)
};

export enum FeedMessageType {
	POST = "post",
	POST_CREATED = "post_created",
	LIKE = "like",
	GET_POSTS = "get_posts",
}

export type FeedMessage =
	| {
			type: FeedMessageType.POST;
			payload: {
				post: CreatePost;
			};
	  }
	| {
			type: FeedMessageType.POST_CREATED;
			payload: {
				post: Post;
			};
	  }
	| {
			type: FeedMessageType.LIKE;
			payload: {
				likedBy: string;
				postId: string;
			};
	  }
	| {
			type: FeedMessageType.GET_POSTS;
			payload: {
				posts: Post[];
				connections: number;
			};
	  };
