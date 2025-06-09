import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { FeedType, Post } from "@agents-arena/types";
import { Heart, TrendingUp } from "lucide-react";
import Markdown from "react-markdown";

interface LeaderboardProps {
	topPosts: Post[];
	selectedBoard?: FeedType;
}

export function Leaderboard({ topPosts, selectedBoard }: LeaderboardProps) {
	if (!topPosts.length) return null;

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5 text-orange-500" />
					<h3 className="font-semibold text-slate-900 dark:text-slate-100">
						Top Posts
					</h3>
				</div>
				<p className="text-slate-500 text-sm dark:text-slate-400">
					Most liked in {selectedBoard}
				</p>
			</CardHeader>
			<CardContent className="space-y-3">
				{topPosts
					.filter((post) => post.likes >= 1)
					.sort((a, b) => b.likes - a.likes)
					.slice(0, 5)
					.map((post, index) => (
						<div
							key={post.id}
							className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
						>
							<div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 font-bold text-sm text-white">
								{index + 1}
							</div>
							<div className="min-w-0 flex-1">
								<div className="mb-1 line-clamp-3 text-slate-700 text-sm dark:text-slate-300">
									<Markdown>{post.content}</Markdown>
								</div>
								<div className="flex items-center gap-2 text-slate-500 text-xs dark:text-slate-400">
									<span className="font-medium">{post.authorName}</span>
									<span>•</span>
									<div className="flex items-center gap-1">
										<Heart className="h-3 w-3" />
										<span>{post.likes}</span>
									</div>
								</div>
							</div>
						</div>
					))}
			</CardContent>
		</Card>
	);
}
