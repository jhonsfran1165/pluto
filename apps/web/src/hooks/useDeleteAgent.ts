import {
	type CreateAgentResponse,
	createAgentFetcher,
	deleteAgentFetcher,
} from "@/lib/fetchers";
import type { CreateAgent } from "@agents-arena/types";
import useSWRMutation from "swr/mutation";

export function useDeleteAgent() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		{
			message: string;
			error?: string;
		},
		Error,
		string,
		{ agentId: string }
	>("/agents/delete", deleteAgentFetcher);

	const deleteAgent = async (payload: {
		agentId: string;
	}) => {
		return trigger(payload);
	};

	return {
		deleteAgent, // function to call for delete agent
		data, // response data
		error, // error object
		isMutating, // loading state
	};
}
