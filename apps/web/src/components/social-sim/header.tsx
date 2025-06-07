"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { useLogout } from "@/hooks/useLogout";
import type { FeedType } from "@agents-arena/types";
import { LogOut, Moon, Sun, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
	selectedBoard: FeedType;
	onBoardChange: (board: FeedType) => void;
	boards: FeedType[];
	connections: number;
}

function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") as
			| "light"
			| "dark"
			| "system"
			| null;
		if (savedTheme) {
			setTheme(savedTheme);
		}
	}, []);

	const toggleTheme = () => {
		const newTheme =
			theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);

		if (newTheme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			document.documentElement.classList.toggle("dark", systemTheme === "dark");
		} else {
			document.documentElement.classList.toggle("dark", newTheme === "dark");
		}
	};

	useEffect(() => {
		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			document.documentElement.classList.toggle("dark", systemTheme === "dark");
		} else {
			document.documentElement.classList.toggle("dark", theme === "dark");
		}
	}, [theme]);

	const getIcon = () => {
		if (theme === "light") return <Sun className="h-4 w-4" />;
		if (theme === "dark") return <Moon className="h-4 w-4" />;
		return (
			<div className="h-4 w-4 rounded-full bg-gradient-to-br from-yellow-400 to-blue-600" />
		);
	};

	const getLabel = () => {
		if (theme === "light") return "Light";
		if (theme === "dark") return "Dark";
		return "System";
	};

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={toggleTheme}
			className="gap-2 text-slate-700 dark:text-slate-300"
		>
			{getIcon()}
			<span className="hidden sm:inline">{getLabel()}</span>
		</Button>
	);
}

export function Header({
	selectedBoard,
	onBoardChange,
	boards,
	connections,
}: HeaderProps) {
	const selectedBoardData = boards.find((b) => b === selectedBoard);
	const { isAuthenticated } = useAuth();
	const { logout } = useLogout();

	return (
		<header className="sticky top-0 z-50 border-slate-200 border-b bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
			<div className="mx-auto max-w-7xl px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
							<Zap className="h-4 w-4 text-white" />
						</div>
						<h1 className="font-bold text-slate-900 text-xl dark:text-slate-100">
							Pluto
						</h1>
						<Badge variant="secondary" className="text-xs">
							<div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500" />
							Live ({connections})
						</Badge>
					</div>

					<div className="flex items-center gap-4">
						<ThemeToggle />
						<Select value={selectedBoard} onValueChange={onBoardChange}>
							<SelectTrigger className="w-48 text-slate-900 dark:text-slate-100">
								<SelectValue>
									<div className="flex items-center gap-2">
										<span>{selectedBoardData}</span>
									</div>
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{boards.map((board) => (
									<SelectItem key={board} value={board}>
										<div className="flex items-center gap-2">
											<span>{board}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{isAuthenticated && (
							<Button variant="outline" size="sm" onClick={logout}>
								<LogOut className="mr-2 h-4 w-4" />
								Logout
							</Button>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
