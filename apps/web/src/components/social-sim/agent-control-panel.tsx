"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { FeedType, FrequencyType, PersonalityType } from "@agents-arena/types";
import { AgentSchema } from "@agents-arena/types";
import { Bot, Plus } from "lucide-react";
import { useState } from "react";
import type { z } from "zod";
import { CreateAgentForm } from "./create-agent-form";

const AgentUser = AgentSchema.omit({
	memory: true,
});

export type AgentUser = z.infer<typeof AgentUser>;

interface AgentControlPanelProps {
	agents: AgentUser[];
	selectedAgent?: AgentUser;
	onAgentSelect: (agent: AgentUser) => void;
	onCreateAgent: (agentData: {
		name: string;
		personality: PersonalityType;
		frequency: FrequencyType;
		prompt: string;
	}) => Promise<boolean>;
	onDeleteAgent: (agentId: string) => Promise<void>;
	selectedBoard: FeedType;
	onUpdateAgent: (agentData: {
		id: string;
		name: string;
		personality: PersonalityType;
		frequency: FrequencyType;
		prompt: string;
	}) => Promise<boolean>;
}

export function AgentControlPanel({
	agents,
	selectedAgent,
	onAgentSelect,
	onCreateAgent,
	onDeleteAgent,
	selectedBoard,
	onUpdateAgent,
}: AgentControlPanelProps) {
	const [showCreateAgent, setShowCreateAgent] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	const handleCreateAgent = async (agentData: {
		name: string;
		personality: PersonalityType;
		frequency: FrequencyType;
		prompt: string;
	}) => {
		setIsCreating(true);
		const success = await onCreateAgent(agentData);
		setIsCreating(false);
		if (success) {
			setShowCreateAgent(false);
		}
	};

	const handleUpdateAgent = async (agentData: {
		id: string;
		name: string;
		personality: PersonalityType;
		frequency: FrequencyType;
		prompt: string;
	}) => {
		setIsUpdating(true);
		const success = await onUpdateAgent(agentData);
		setIsUpdating(false);
		if (success) {
			setShowCreateAgent(false);
		}
	};

	const handleDeleteAgent = async (agentId: string) => {
		setIsDeleting(true);
		await onDeleteAgent(agentId);
		setShowCreateAgent(false);
		onAgentSelect(undefined as unknown as AgentUser);
		setIsDeleting(false);
	};

	return (
		<Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:border-purple-800 dark:from-purple-950/50 dark:to-pink-950/50">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
						<h3 className="font-semibold text-slate-900 dark:text-slate-100">
							Agent Control
						</h3>
					</div>
					<Dialog open={showCreateAgent} onOpenChange={setShowCreateAgent}>
						<DialogTrigger asChild>
							<Button
								size="sm"
								variant="outline"
								className="gap-1 text-slate-700 dark:text-slate-300"
							>
								<Plus className="h-3 w-3" />
								Create
							</Button>
						</DialogTrigger>
						<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
							<DialogHeader>
								<DialogTitle>
									{selectedAgent ? "Edit Agent" : "Create New Agent"}
								</DialogTitle>
							</DialogHeader>
							<CreateAgentForm
								onCreate={handleCreateAgent}
								onUpdate={selectedAgent ? handleUpdateAgent : undefined}
								initialAgent={
									selectedAgent
										? {
												name: selectedAgent.name,
												personality: selectedAgent.personality,
												frequency: selectedAgent.postingFrequency,
												prompt: selectedAgent.prompt,
												id: selectedAgent.id,
											}
										: undefined
								}
								onDelete={
									selectedAgent
										? () => {
												handleDeleteAgent(selectedAgent.id);
											}
										: undefined
								}
								isCreating={isCreating}
								isUpdating={isUpdating}
								isDeleting={isDeleting}
							/>
						</DialogContent>
					</Dialog>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Removed selectedAgent details card. Only keep the agent list and modal. */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h4 className="font-medium text-slate-700 text-sm dark:text-slate-300">
							All Agents
						</h4>
						<span className="text-slate-500 text-xs dark:text-slate-400">
							{agents.length} total
						</span>
					</div>
					<div className="space-y-2">
						{/* filter agents by feed */}
						{agents.filter((agent) => agent.feed === selectedBoard).map((agent) => (
							<button
								key={agent.id}
								type="button"
								className={cn(
									"flex w-full cursor-pointer items-center justify-between rounded-lg border border-purple-100 bg-white/80 p-2 text-left transition-all hover:bg-purple-50 dark:border-purple-800 dark:bg-slate-900/70 dark:hover:bg-purple-900/60",
								)}
								onClick={() => {
									setShowCreateAgent(true);
									onAgentSelect(agent);
								}}
							>
								<div className="flex min-w-0 flex-col">
									<span className="truncate px-2 font-medium text-lg text-slate-900 dark:text-slate-100">
										{agent.name.toUpperCase()}
									</span>
									<div className="flex items-center gap-1 px-1 py-1">
										<Badge
											variant="outline"
											className="border-slate-200 bg-slate-100 px-1.5 py-0 font-normal text-[10px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
										>
											{agent.personality}
										</Badge>
										<Badge
											variant="outline"
											className="border-slate-200 bg-slate-100 px-1.5 py-0 font-normal text-[10px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
										>
											{agent.postingFrequency.name}
										</Badge>
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
