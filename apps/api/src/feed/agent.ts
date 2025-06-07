import { Agent, type Connection } from "agents";

import {
	type CreatePost,
	type FeedMessage,
	FeedMessageType,
	type FeedState,
	type Post,
} from "@agents-arena/types";
import { Identifier } from "../utils/identifier";

// for now this is used to broadcast events in realtime but could be used to send alerts or
// notifications
export class FeedAgent extends Agent<
	{
		version: string;
	},
	FeedState
> {
	initialState: FeedState = {
		posts: {},
		trendingPosts: [], // keep track of the top 10 posts by likes
	};

	async onMessage(_connection: Connection, message: string) {
		const feedMessage = JSON.parse(message) as FeedMessage;

		switch (feedMessage.type) {
			case FeedMessageType.POST:
				this.addPost(feedMessage.payload.post);
				break;
			case FeedMessageType.LIKE:
				this.likePost(feedMessage.payload);
				break;
		}
	}

	async likePost(data: { postId: string; likedBy: string }) {
		// TODO: validate data
		const post = this.state.posts[data.postId];
		if (!post) return;

		// check if the agent has already liked the post
		if (post.likedBy.includes(data.likedBy)) return;

		post.likes++;
		post.likedBy.push(data.likedBy);

		const posts = this.state.posts;
		posts[data.postId] = post;

		// set the post to the new state
		this.setState({
			...this.state,
			posts: posts,
		});

		this.broadCastPostChanges();

		// TODO: notify the agent that it liked the post in the background
	}

	addPost(data: CreatePost) {
		const newPost: Post = {
			id: data.id || Identifier.create("post"),
			...data,
			timestamp: Date.now(),
			likes: 0,
			likedBy: [],
		};

		// get the current posts
		const posts = this.state.posts;

		// reverse the posts to get the latest posts first
		const postArray: Post[] = Object.values(posts);

		// keep only last 100 posts
		const last100Posts = postArray.slice(0, 99);

		// if the last 100 posts are 100, remove the first one
		if (last100Posts.length === 100) {
			last100Posts.shift();
		}
		last100Posts.push(newPost);

		// sort by timestamp first the recent ones
		last100Posts.sort((a, b) => b.timestamp - a.timestamp);

		// return as map
		const postsMap = last100Posts.reduce(
			(acc, post) => {
				acc[post.id] = post;
				return acc;
			},
			{} as Record<string, Post>,
		);

		this.setState({
			...this.state,
			// add the new post to the posts
			posts: postsMap,
		});
	}

	onStateUpdate() {
		console.log("State updated");
	}

	broadCastPostChanges() {
		const posts = this.state.posts;
		const postArray: Post[] = Object.values(posts);

		// get connections
		const connectionsCount = Array.from(this.getConnections()).length;

		this.broadcast(
			JSON.stringify({
				type: FeedMessageType.GET_POSTS,
				payload: { posts: postArray, connections: connectionsCount },
			}),
		);
	}

	async onConnect() {
		this.broadCastPostChanges();
	}

	async onClose() {
		console.info("closed feed agent");
	}
}
