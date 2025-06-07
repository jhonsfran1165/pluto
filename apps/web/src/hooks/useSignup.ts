// src/hooks/useSignup.ts

import {
	type SignupPayload,
	type SignupResponse,
	signupFetcher,
} from "@/lib/fetchers";
import useSWRMutation from "swr/mutation";

export function useSignup() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		SignupResponse,
		Error,
		string,
		SignupPayload
	>("/auth/signup", signupFetcher);

	// Optionally, you can wrap trigger for easier use
	const signup = async (payload: SignupPayload) => {
		return trigger(payload);
	};

	return {
		signup, // function to call for signup
		data, // response data
		error, // error object
		isMutating, // loading state
	};
}
