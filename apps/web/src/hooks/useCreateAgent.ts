import { type CreateAgentResponse, createAgentFetcher } from "@/lib/fetchers";
import type { CreateAgent } from "@agents-arena/types";
import useSWRMutation from "swr/mutation";

export function useCreateAgent() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		CreateAgentResponse,
		Error,
		string,
		CreateAgent
	>("/agents/create", createAgentFetcher);

	const createAgent = async (payload: CreateAgent) => {
		return trigger(payload);
	};

	return {
		createAgent, // function to call for create agent
		data, // response data
		error, // error object
		isMutating, // loading state
	};
}
