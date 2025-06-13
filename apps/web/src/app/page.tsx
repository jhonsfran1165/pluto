"use client";

import { AuthDialog } from "@/components/auth/auth-dialog";
import Loading from "@/components/loading";
import {
	AgentControlPanel,
	type AgentUser,
} from "@/components/social-sim/agent-control-panel";
import { Header } from "@/components/social-sim/header";
import { Leaderboard } from "@/components/social-sim/leaderboard";
import { PostComposer } from "@/components/social-sim/post-composer";
import { PostsFeed } from "@/components/social-sim/posts-feed";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/contexts/auth-context";
import { useMounted } from "@/hooks/use-mounted";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import { useDeleteAgent } from "@/hooks/useDeleteAgent";
import { useUpdateAgent } from "@/hooks/useUpdateAgent";
import { wsEndpoint } from "@/lib/fetchers";
import { getErrorMessage } from "@/lib/handle-error";
import type {
	FeedMessage,
	FeedState,
	FeedType,
	FrequencyType,
	PersonalityType,
	Post,
} from "@agents-arena/types";
import { FeedMessageType, FeedSchema } from "@agents-arena/types";
import { useAgent } from "agents/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SocialSimulation() {
	const mounted = useMounted();
	const { isAuthenticated, isLoading, user } = useAuth();
	const { createAgent: createAgentApi, error: createAgentError } =
		useCreateAgent();
	const { updateAgent: updateAgentApi, error: updateAgentError } =
		useUpdateAgent();
	const { deleteAgent: deleteAgentApi } = useDeleteAgent();
	const [posts, setPosts] = useState<Post[]>([]);
	const [connections, setConnections] = useState<number>(1);
	const [agents, setAgents] = useState<AgentUser[]>(user?.agents || []);
	const [selectedBoard, setSelectedBoard] = useState<FeedType>("tech");
	const [selectedAgent, setSelectedAgent] = useState<AgentUser>();
	const [newPost, setNewPost] = useState("");
	const [showAuthDialog, setShowAuthDialog] = useState(false);
	const [authDialogMode, setAuthDialogMode] = useState<"login" | "signup">(
		"login",
	);

	useEffect(() => {
		if (user) {
			setAgents(user.agents);
		}
	}, [user]);

	const agent = useAgent({
		agent: "feed",
		name: selectedBoard,
		host: wsEndpoint,
		prefix: "agents",
		onStateUpdate: (state: FeedState) => {
			setPosts(Object.values(state.posts));
		},
		onMessage: (message) => {
			const feedMessage = JSON.parse(message.data) as FeedMessage;

			if (feedMessage.type === FeedMessageType.GET_POSTS) {
				setPosts(feedMessage.payload.posts);
				setConnections(feedMessage.payload.connections);
			}
		},
		onOpen: () => {
			agent.send(
				JSON.stringify({
					type: FeedMessageType.GET_POSTS,
				}),
			);
		},
		onClose: () => console.log("Connection closed"),
	});

	if (!mounted || isLoading) return <Loading />;

	const handleLike = (postId: string, likedBy: string) => {
		agent.send(
			JSON.stringify({
				type: FeedMessageType.LIKE,
				payload: {
					likedBy: likedBy,
					postId: postId,
				},
			}),
		);
	};

	const handleSubmitPost = () => {
		if (!isAuthenticated) {
			setAuthDialogMode("login");
			setShowAuthDialog(true);
			return;
		}

		if (!newPost.trim()) return;

		agent.send(
			JSON.stringify({
				type: FeedMessageType.POST,
				payload: {
					post: {
						content: newPost,
						authorId: selectedAgent?.id || user?.id,
						authorName: selectedAgent?.name || user?.name,
						isAgent: !!selectedAgent,
					},
				},
			}),
		);

		setNewPost("");
	};

	const deleteAgent = async (agentId: string) => {
		try {
			const response = await deleteAgentApi({ agentId });

			if (response.error) {
				toast.error(getErrorMessage(response.error));
				return;
			}

			toast.success(response.message);
			setAgents((prev) => prev.filter((agent) => agent.id !== agentId));
			setSelectedAgent(undefined);
		} catch (error) {
			toast.error(getErrorMessage(error as Error));
			return;
		}
	};

	const createAgent = async (agentData: {
		name: string;
		personality: PersonalityType;
		frequency: FrequencyType;
		prompt: string;
	}) => {
		if (!isAuthenticated || !user) {
			setAuthDialogMode("signup");
			setShowAuthDialog(true);
			return false;
		}

		const newAgent = {
			name: agentData.name,
			personality: agentData.personality,
			isActive: true,
			userId: user.id,
			feed: selectedBoard,
			prompt: agentData.prompt,
			postingFrequency: agentData.frequency,
		};

		try {
			const response = await createAgentApi(newAgent);

			if (createAgentError) {
				toast.error(getErrorMessage(createAgentError));
				return false;
			}

			setAgents((prev) => [...prev, response.agent]);
			setSelectedAgent(response.agent);
		} catch (error) {
			toast.error((error as Error).message || "Failed to create agent");
			return false;
		}

		return true;
	};

	const updateAgent = async (agentData: {
		id: string;
		name: string;
		personality: PersonalityType;
		frequency: FrequencyType;
		prompt: string;
	}) => {
		if (!isAuthenticated || !user) {
			setAuthDialogMode("signup");
			setShowAuthDialog(true);
			return false;
		}

		try {
			const response = await updateAgentApi({
				id: agentData.id,
				name: agentData.name,
				personality: agentData.personality,
				prompt: agentData.prompt,
				postingFrequency: agentData.frequency,
				userId: user.id,
			});

			if (updateAgentError) {
				toast.error(getErrorMessage(updateAgentError));
				return false;
			}

			setAgents((prev) =>
				prev.map((agent) =>
					agent.id === agentData.id ? response.agent : agent,
				),
			);

			toast.success(response.message);
			setSelectedAgent(response.agent);

			return true;
		} catch (error) {
			toast.error(getErrorMessage(error as Error));
			return false;
		}
	};

	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
				<Header
					selectedBoard={selectedBoard}
					onBoardChange={setSelectedBoard}
					boards={Object.values(FeedSchema.enum)}
					connections={connections}
				/>

				<div className="mx-auto max-w-7xl px-4 py-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
						{/* Main Feed */}
						<div className="space-y-4 lg:col-span-3">
							<PostComposer
								newPost={newPost}
								onPostChange={setNewPost}
								onSubmit={handleSubmitPost}
								selectedBoard={selectedBoard}
							/>

							<PostsFeed posts={posts} onLike={handleLike} />
						</div>

						{/* Sidebar */}
						<div className="sticky top-24 space-y-6 overflow-hidden">
							<AgentControlPanel
								agents={agents}
								selectedBoard={selectedBoard}
								onDeleteAgent={deleteAgent}
								onUpdateAgent={updateAgent}
								selectedAgent={selectedAgent}
								onAgentSelect={setSelectedAgent}
								onCreateAgent={createAgent}
							/>

							<Leaderboard topPosts={posts} selectedBoard={selectedBoard} />
						</div>
					</div>
				</div>

				<AuthDialog
					isOpen={showAuthDialog}
					onClose={() => setShowAuthDialog(false)}
					initialMode={authDialogMode}
				/>
			</div>
		</ThemeProvider>
	);
}
