import {
	type UpdateAgent,
	type UpdateAgentResponse,
	updateAgentFetcher,
} from "@/lib/fetchers";
import useSWRMutation from "swr/mutation";

export function useUpdateAgent() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		UpdateAgentResponse,
		Error,
		string,
		UpdateAgent
	>("/agents/update", updateAgentFetcher);

	const updateAgent = async (payload: UpdateAgent) => {
		return trigger(payload);
	};

	return {
		updateAgent, // function to call for update agent
		data, // response data
		error, // error object
		isMutating, // loading state
	};
}
