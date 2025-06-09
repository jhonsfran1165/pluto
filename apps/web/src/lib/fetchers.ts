import { env } from "@/env";


export const API_URL = env.NEXT_PUBLIC_API_URL;
const apiEndpoint = `${API_URL}/api/v1`;
export const wsEndpoint = env.NODE_ENV === "development" ? API_URL.replace("http://", "ws://") : API_URL.replace("https://", "wss://");

import type {
	AgentState,
	CreateAgent,
	FrequencyType,
	PersonalityType,
	UserAccount,
} from "@agents-arena/types";

import { getErrorMessage } from "@/lib/handle-error";

export type SignupPayload = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export type SignupResponse = {
	message: string;
	error?: string;
};

export type LoginPayload = {
	email: string;
	password: string;
};

export type LoginResponse = {
	message: string;
	user: UserAccount;
	error?: string;
};

async function fetchWithRefresh(url: string, options: RequestInit) {
	const response = await fetch(`${apiEndpoint}${url}`, options);

	if (response.status === 401) {
		// Try to refresh the token by making a request to /me
		const refreshResponse = await fetch(`${apiEndpoint}/auth/me`, {
			credentials: "include",
		});

		if (refreshResponse.ok) {
			// Token was refreshed, retry the original request
			return fetch(`${apiEndpoint}${url}`, options);
		}
	}

	return response;
}

export async function loginFetcher(
	url: string,
	{ arg }: { arg: LoginPayload },
): Promise<LoginResponse> {
	const res = await fetchWithRefresh(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(arg),
	});

	const data = await res.json();
	if (data.error) {
		throw new Error(data.error);
	}
	return data;
}

export async function signupFetcher(
	url: string,
	{ arg }: { arg: SignupPayload },
): Promise<SignupResponse> {
	const res = await fetchWithRefresh(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(arg),
	});

	const data = await res.json();

	if (data.error) {
		throw new Error(data.error);
	}

	return data;
}

export type CreateAgentResponse = {
	message: string;
	agent: AgentState;
	error?: string;
};

export type UpdateAgentResponse = {
	message: string;
	agent: AgentState;
	error?: string;
};

export type UpdateAgent = {
	id: string;
	name: string;
	personality: PersonalityType;
	postingFrequency: FrequencyType;
	prompt: string;
	userId: string;
};

export async function createAgentFetcher(
	url: string,
	{ arg }: { arg: CreateAgent },
): Promise<CreateAgentResponse> {
	const res = await fetchWithRefresh(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(arg),
	});

	const data = await res.json();

	if (data.error) {
		throw new Error(getErrorMessage(data.error));
	}

	return data as CreateAgentResponse;
}

export async function updateAgentFetcher(
	url: string,
	{ arg }: { arg: UpdateAgent },
): Promise<UpdateAgentResponse> {
	const res = await fetchWithRefresh(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(arg),
	});

	const data = await res.json();

	if (data.error) {
		throw new Error(getErrorMessage(data.error));
	}

	return data as UpdateAgentResponse;
}

export async function deleteAgentFetcher(
	url: string,
	{ arg }: { arg: { agentId: string } },
): Promise<{
	message: string;
	error?: string;
}> {
	const res = await fetchWithRefresh(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(arg),
	});

	const data = await res.json();

	if (data.error) {
		throw new Error(getErrorMessage(data.error));
	}

	return data;
}
