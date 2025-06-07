import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useLogout() {
	const { logout } = useAuth();
	const router = useRouter();

	const handleLogout = useCallback(async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to logout");
			}

			logout();
			router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
			throw error;
		}
	}, [logout, router]);

	return { logout: handleLogout };
}
