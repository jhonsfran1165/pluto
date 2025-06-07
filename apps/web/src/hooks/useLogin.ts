// src/hooks/useSignup.ts

import {
	type LoginPayload,
	type LoginResponse,
	type SignupPayload,
	type SignupResponse,
	loginFetcher,
	signupFetcher,
} from "@/lib/fetchers";
import useSWRMutation from "swr/mutation";

export function useLogin() {
	const { trigger, data, error, isMutating } = useSWRMutation<
		LoginResponse,
		Error,
		string,
		LoginPayload
	>("/auth/login", loginFetcher);

	// Optionally, you can wrap trigger for easier use
	const login = async (payload: LoginPayload) => {
		return trigger(payload);
	};

	return {
		login, // function to call for login
		data, // response data
		error, // error object
		isMutating, // loading state
	};
}
