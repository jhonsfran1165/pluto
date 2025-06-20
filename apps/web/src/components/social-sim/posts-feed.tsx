import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import type { Post } from "@agents-arena/types";
import { Bot, Heart, MessageSquare, Share, Sparkles, User } from "lucide-react";
import Markdown from "react-markdown";

interface PostsFeedProps {
	posts: Post[];
	onLike: (postId: string, likedBy: string) => void;
}

export function PostsFeed({ posts, onLike }: PostsFeedProps) {
	const { user } = useAuth();

	const formatTimeAgo = (date: Date) => {
		const now = new Date();
		const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

		if (diffInMinutes < 1) return "just now";
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
		return `${Math.floor(diffInMinutes / 1440)}d ago`;
	};

	const handleShare = (post: Post) => {
		const baseUrl = window.location.origin;
		const ogUrl = `${baseUrl}/og?text=${encodeURIComponent(post.content)}`;
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			`"${post.content}" - ${post.authorName} ${post.isAgent ? '🤖' : ''}`
		)}&url=${encodeURIComponent(ogUrl)}`;

		window.open(twitterUrl, '_blank', 'width=550,height=420');
	};

	if (!posts.length) {
		return (
			<div className="flex flex-col items-center justify-center px-4 py-16">
				<div className="mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 p-6 dark:from-purple-900/20 dark:to-pink-900/20">
					<MessageSquare className="h-12 w-12 text-purple-600 dark:text-purple-400" />
				</div>
				<h3 className="mb-2 font-semibold text-slate-900 text-xl dark:text-slate-100">
					No posts yet
				</h3>
				<p className="mb-6 max-w-md text-center text-slate-600 dark:text-slate-400">
					Be the first to share something! The conversation starts with you and
					the AI agents.
				</p>
				<div className="flex items-center gap-2 text-slate-500 text-sm dark:text-slate-400">
					<Sparkles className="h-4 w-4" />
					<span>AI agents are waiting to engage</span>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{posts.map((post) => (
				<Card
					key={post.id}
					className="group transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-700/20"
				>
					<CardContent className="p-4">
						<div className="flex items-start gap-3">
							<Avatar className="h-10 w-10">
								<AvatarFallback
									className={cn(
										"font-medium text-white",
										post?.isAgent
											? "bg-gradient-to-br from-purple-500 to-pink-500"
											: "bg-gradient-to-br from-blue-500 to-cyan-500",
									)}
								>
									{post?.isAgent ? (
										<Bot className="h-5 w-5" />
									) : (
										<User className="h-5 w-5" />
									)}
								</AvatarFallback>
							</Avatar>

							<div className="min-w-0 flex-1">
								<div className="mb-2 flex items-center gap-2">
									<span className="font-semibold text-slate-900 dark:text-slate-100">
										{post.authorName}
									</span>
									{post?.isAgent && (
										<Badge
											variant="secondary"
											className="bg-purple-100 text-purple-700 text-xs dark:bg-purple-900 dark:text-purple-300"
										>
											<Bot className="mr-1 h-3 w-3" />
											Agent
										</Badge>
									)}
									<span className="text-slate-500 text-sm dark:text-slate-400">
										{formatTimeAgo(new Date(post.timestamp))}
									</span>
								</div>

								<div className="prose dark:prose-invert mb-3 prose-img:rounded-xl prose-p:text-justify prose-h1:font-bold prose-a:text-blue-600 prose-h1:text-xl text-slate-700 leading-relaxed dark:text-slate-300">
									<Markdown>{post.content}</Markdown>
								</div>

								{user && (
									<div className="flex items-center gap-4">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onLike(post.id, user.id)}
											className={cn(
												"gap-2 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400",
												post.likedBy.includes(user.id) &&
													"bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
											)}
										>
											<Heart
												className={cn(
													"h-4 w-4",
													post.likedBy.includes(user.id) && "fill-current",
												)}
											/>
											<span className="font-medium">{post.likes}</span>
										</Button>

										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleShare(post)}
											className="gap-2 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
										>
											<Share className="h-4 w-4" />
											<span className="font-medium">Share</span>
										</Button>
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
