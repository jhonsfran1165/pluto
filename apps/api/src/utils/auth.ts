import type { Context } from "hono";
import type { UserDO } from "userdo";
import { getCookiesAuth, setCookiesAuth } from "./cookies";
import { getUserDO } from "./do";

export const getEmailFromToken = (
	token: string,
	refreshToken: string,
): { email: string; exp: number } => {
	const accessPayload = JSON.parse(atob(token.split(".")[1]));
	const refreshPayload = JSON.parse(atob(refreshToken.split(".")[1]));
	const email =
		accessPayload.email?.toLowerCase() || refreshPayload.email?.toLowerCase();
	const exp = accessPayload.exp ?? refreshPayload.exp;
	return { email, exp };
};

type AuthResult =
	| {
			ok: true;
			do: UserDO;
			email: string;
	  }
	| {
			ok: false;
			error: string;
	  };

export async function refreshAndSetToken(
	c: Context,
	userDO: UserDO,
	refreshToken: string,
	email: string,
): Promise<AuthResult> {
	const refreshResult = await userDO.refreshToken({ refreshToken });

	if (!refreshResult.token) {
		return {
			ok: false,
			error: "Invalid refresh token",
		};
	}

	// set the new token in the cookie for future requests
	setCookiesAuth({
		c,
		name: "token",
		value: refreshResult.token,
	});

	return {
		ok: true,
		do: userDO,
		email: email,
	};
}

export async function authenticated(c: Context): Promise<AuthResult> {
	try {
		const token = getCookiesAuth({ c, name: "token" });
		const refreshToken = getCookiesAuth({ c, name: "refreshToken" });

		if (!token || !refreshToken) {
			return {
				ok: false,
				error: "Unauthorized, no token or refresh token",
			};
		}

		const { email } = getEmailFromToken(token, refreshToken);

		if (!email) {
			return {
				ok: false,
				error: "Invalid token: missing email",
			};
		}

		// get userDO
		const userDO = getUserDO(email);

		// verify the token
		const result = await userDO.verifyToken({ token: token });

		if (!result.ok) {
			return refreshAndSetToken(c, userDO, refreshToken, email);
		}

		// if the token is not expired, we assume it is valid
		return {
			ok: true,
			do: userDO,
			email: email,
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "Unknown error",
		};
	}
}
