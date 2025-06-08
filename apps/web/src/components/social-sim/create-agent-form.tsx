import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	type FrequencyType,
	PersonalitySchema,
	type PersonalityType,
	postingFrequencies,
} from "@agents-arena/types";
import { Edit3, Loader2 } from "lucide-react";
import { useState } from "react";

interface CreateAgentFormProps {
	onCreate: (agentData: {
		name: string;
		personality: PersonalityType;
		frequency: FrequencyType;
		prompt: string;
	}) => void;
	onUpdate?: (agentData: {
		id: string;
		name: string;
		personality: PersonalityType;
		frequency: FrequencyType;
		prompt: string;
	}) => void;
	onDelete?: () => void;
	initialAgent?: {
		id?: string;
		name: string;
		personality: PersonalityType;
		frequency: FrequencyType;
		prompt: string;
	};
	isCreating: boolean;
	isUpdating: boolean;
	isDeleting: boolean;
}

const personalities = Object.values(PersonalitySchema.enum);
const frequencies = postingFrequencies;

export function CreateAgentForm({
	onCreate,
	onUpdate,
	onDelete,
	initialAgent,
	isCreating,
	isUpdating,
	isDeleting,
}: CreateAgentFormProps) {
	const [newAgentName, setNewAgentName] = useState(initialAgent?.name || "");
	const [newAgentFrequency, setNewAgentFrequency] = useState<FrequencyType>(
		initialAgent?.frequency || frequencies[2],
	);
	const [personality, setPersonality] = useState<PersonalityType>(
		initialAgent?.personality || personalities[0],
	);
	const [customPrompt, setCustomPrompt] = useState(initialAgent?.prompt || "");

	const handleSubmit = () => {
		if (initialAgent?.id && onUpdate) {
			onUpdate({
				id: initialAgent.id,
				name: newAgentName,
				personality: personality,
				frequency: newAgentFrequency,
				prompt: customPrompt,
			});
		} else {
			onCreate({
				name: newAgentName,
				personality: personality,
				frequency: newAgentFrequency,
				prompt: customPrompt,
			});
		}
	};

	return (
		<div className="space-y-8">
			{/* Basic Information Section */}
			<div className="space-y-6">
				<h3 className="font-medium text-lg">Basic Information</h3>
				<div>
					<Label htmlFor="agent-name">Agent Name</Label>
					<Input
						id="agent-name"
						placeholder="Agent Beta"
						value={newAgentName}
						onChange={(e) => setNewAgentName(e.target.value)}
						className="mt-2"
					/>
				</div>

				<div>
					<Label>Posting Frequency</Label>
					<Select
						value={newAgentFrequency.name}
						onValueChange={(value) => {
							const frequency = frequencies.find((f) => f.name === value);
							if (frequency) setNewAgentFrequency(frequency);
						}}
					>
						<SelectTrigger className="mt-2 w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{frequencies.map((frequency) => (
								<SelectItem key={frequency.name} value={frequency.name}>
									{`Every ${frequency.value} ${frequency.unit}`}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Personality Section */}
			<div className="space-y-6">
				<h3 className="font-medium text-lg">Personality Settings</h3>
				<div>
					<Label>Choose Personality</Label>
					<Select
						value={personality}
						onValueChange={(value) => {
							setPersonality(value as PersonalityType);
						}}
					>
						<SelectTrigger className="mt-2 w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{personalities.map((personality) => (
								<SelectItem key={personality} value={personality}>
									<div className="flex items-center gap-2">
										<span>{personality}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="custom-prompt">Personality Prompt</Label>
					<Textarea
						id="custom-prompt"
						placeholder="You are a creative storyteller who loves to weave narratives into everyday topics. You often use metaphors and speak in an engaging, narrative style. You see stories everywhere and love to share them with others."
						value={customPrompt}
						onChange={(e) => setCustomPrompt(e.target.value)}
						className="mt-2 min-h-[100px]"
					/>
					<p className="mt-1 text-slate-500 text-xs dark:text-slate-400">
						Describe how this agent should behave and communicate. Use{" "}
						{"{topic}"} to reference the current discussion topic.
					</p>
				</div>

				<div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/50">
					<div className="flex items-start gap-2">
						<Edit3 className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
						<div>
							<h4 className="font-medium text-blue-900 text-sm dark:text-blue-100">
								Example Custom Prompts:
							</h4>
							<ul className="mt-1 space-y-1 text-blue-700 text-xs dark:text-blue-300">
								<li>
									• "You are a poetic soul who speaks in metaphors about{" "}
									{"{topic}"}"
								</li>
								<li>
									• "You're a time traveler commenting on {"{topic}"} from
									different eras"
								</li>
								<li>
									• "You're a detective analyzing {"{topic}"} like solving a
									mystery"
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between gap-2">
				{onDelete && (
					<Button
						onClick={onDelete}
						variant="destructive"
						disabled={isDeleting}
					>
						Delete Agent
						{isDeleting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
					</Button>
				)}

				<Button
					onClick={handleSubmit}
					disabled={!newAgentName.trim() || isCreating || isUpdating}
				>
					{initialAgent?.id ? "Update Agent" : "Create Agent"}
					{isCreating ||
						(isUpdating && <Loader2 className="ml-2 h-4 w-4 animate-spin" />)}
				</Button>
			</div>
		</div>
	);
}
