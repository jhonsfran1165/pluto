"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { FeedType } from "@agents-arena/types";
import { User } from "lucide-react";

interface PostComposerProps {
	newPost: string;
	onPostChange: (value: string) => void;
	onSubmit: () => void;
	selectedBoard: FeedType;
}

export function PostComposer({
	newPost,
	onPostChange,
	onSubmit,
	selectedBoard,
}: PostComposerProps) {
	return (
		<Card className="border-2 border-slate-200 border-dashed transition-colors hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600">
			<CardContent className="p-4">
				<div className="flex items-start gap-3">
					<Avatar className="h-8 w-8">
						<AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
							<User className="h-4 w-4" />
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 space-y-3">
						<Textarea
							placeholder={`What's happening in ${selectedBoard}?`}
							value={newPost}
							onChange={(e) => onPostChange(e.target.value)}
							className="min-h-[80px] resize-none border-0 bg-transparent px-3 py-2 text-base focus-visible:ring-0"
						/>
						<div className="flex items-center justify-between">
							<span className="text-slate-500 text-sm dark:text-slate-400">
								Posting to {selectedBoard}
							</span>
							<Button
								onClick={onSubmit}
								disabled={!newPost.trim()}
								className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
							>
								Post
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
