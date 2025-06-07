import { Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<Loader2 className="animate-spin" />
		</div>
	);
}
