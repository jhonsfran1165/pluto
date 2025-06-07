import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useLogin } from "@/hooks/useLogin";
import { useSignup } from "@/hooks/useSignup";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type AuthMode = "login" | "signup";

interface AuthDialogProps {
	isOpen: boolean;
	onClose: () => void;
	initialMode?: AuthMode;
}

export function AuthDialog({
	isOpen,
	onClose,
	initialMode = "login",
}: AuthDialogProps) {
	const [mode, setMode] = useState<AuthMode>(initialMode);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const { isAuthenticated } = useAuth();
	const { login, error: errorLogin, isMutating: isLoginMutating } = useLogin();
	const {
		signup,
		error: errorSignup,
		isMutating: isSignupMutating,
	} = useSignup();

	const isMutating = mode === "login" ? isLoginMutating : isSignupMutating;

	useEffect(() => {
		if (isAuthenticated) {
			onClose();
		}
	}, [isAuthenticated, onClose]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (mode === "signup") {
			if (password !== confirmPassword) {
				setError("Passwords do not match");
				return;
			}

			if (password.length < 6) {
				setError("Password must be at least 6 characters long");
				return;
			}

			const userData = {
				name,
				email,
				password,
				confirmPassword,
			};

			const response = await signup(userData);

			if (response.message) {
				setMode("login");
			} else {
				setError(response.error || "An unknown error occurred");
			}
		} else {
			try {
				const response = await login({ email, password });

				if (response.user.id) {
					onClose();
				} else {
					setError(errorLogin?.message || "An unknown error occurred");
				}
			} catch (error) {
				setError(
					error instanceof Error ? error.message : "An unknown error occurred",
				);
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{mode === "login" ? "Welcome back" : "Create an account"}
					</DialogTitle>
					<DialogDescription>
						{mode === "login"
							? "Please sign in to your account"
							: "Join our community of AI enthusiasts"}
					</DialogDescription>
				</DialogHeader>

				<form className="mt-4 space-y-4" onSubmit={handleSubmit}>
					{mode === "signup" && (
						<div>
							<Label htmlFor="name">Full name</Label>
							<Input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="mt-1"
								placeholder="Enter your full name"
							/>
						</div>
					)}
					<div>
						<Label htmlFor="email">Email address</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="mt-1"
							placeholder="Enter your email"
						/>
					</div>
					<div>
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1"
							placeholder={
								mode === "login" ? "Enter your password" : "Create a password"
							}
						/>
					</div>
					{mode === "signup" && (
						<div>
							<Label htmlFor="confirmPassword">Confirm password</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="mt-1"
								placeholder="Confirm your password"
							/>
						</div>
					)}
					{error && (
						<div className="text-center text-red-500 text-sm dark:text-red-400">
							{error}
						</div>
					)}
					<Button type="submit" className="w-full" disabled={isMutating}>
						{isMutating ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : mode === "login" ? (
							"Sign in"
						) : (
							"Create account"
						)}
					</Button>
					<div className="text-center text-sm">
						<span className="text-slate-600 dark:text-slate-400">
							{mode === "login"
								? "Don't have an account? "
								: "Already have an account? "}
						</span>
						<button
							type="button"
							onClick={() => setMode(mode === "login" ? "signup" : "login")}
							className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
						>
							{mode === "login" ? "Create one" : "Sign in"}
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
