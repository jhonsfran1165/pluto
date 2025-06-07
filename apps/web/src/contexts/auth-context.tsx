"use client";

import type { UserProfile } from "@agents-arena/types";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	isLoading: boolean;
	user: UserProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<UserProfile | null>(null);
	const router = useRouter();

	const refreshToken = async () => {
		try {
			const response = await fetch("http://localhost:8787/api/v1/auth/me", {
				credentials: "include",
			});

			if (response.ok) {
				const user = (await response.json()) as { profile: UserProfile };
				setUser(user.profile);
				setIsAuthenticated(true);
				return true;
			}
			return false;
		} catch (error) {
			return false;
		}
	};

	useEffect(() => {
		// Check if user is authenticated by making a request to verify the JWT
		const checkAuth = async () => {
			try {
				const response = await fetch("http://localhost:8787/api/v1/auth/me", {
					credentials: "include", // Important: This ensures cookies are sent with the request
				});

				if (response.ok) {
					const user = (await response.json()) as { profile: UserProfile };
					setUser(user.profile);
					setIsAuthenticated(true);
				} else if (response.status === 401) {
					// Try to refresh the token
					const refreshed = await refreshToken();
					if (!refreshed) {
						setIsAuthenticated(false);
						setUser(null);
					}
				} else {
					setIsAuthenticated(false);
					setUser(null);
				}
				setIsLoading(false);
			} catch (error) {
				setIsAuthenticated(false);
				setIsLoading(false);
				setUser(null);
			}
		};
		checkAuth();
	}, []);

	const login = async (email: string, password: string) => {
		const response = await fetch("http://localhost:8787/api/v1/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Important: This ensures cookies are sent with the request
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			throw new Error("Login failed");
		}

		setIsAuthenticated(true);
		router.push("/");
	};

	const logout = async () => {
		try {
			await fetch("http://localhost:8787/api/v1/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			setIsAuthenticated(false);
			router.push("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, login, logout, isLoading, user }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
