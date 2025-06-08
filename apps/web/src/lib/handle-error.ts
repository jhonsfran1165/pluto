import { z } from "zod";
import { fromZodIssue } from "zod-validation-error";

export function getErrorMessage(err: unknown) {
	const unknownError = "Something went wrong, please try again later.";

	if (err instanceof z.ZodError) {
		const errors = err.issues.map((issue) => {
			return fromZodIssue(issue).toString();
		});
		return errors.join("\n");
	}

	if (
		typeof err === "object" &&
		err !== null &&
		"name" in err &&
		err.name === "ZodError"
	) {
		const error = err as z.ZodError;
		return error.issues
			.map((issue) => {
				return fromZodIssue(issue).toString();
			})
			.join("\n");
	}

	if (err instanceof Error) {
		return err.message;
	}

	return unknownError;
}
