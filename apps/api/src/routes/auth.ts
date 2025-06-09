import type { UserProfile } from "@agents-arena/types";
import { LoginSchema, UserSchema } from "@agents-arena/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import { z } from "zod";
import { authenticated } from "~/utils/auth";
import { USER_DO_KEYS } from "~/utils/constant";
import { setCookiesAuth } from "~/utils/cookies";
import { Identifier } from "~/utils/identifier";
import type { HonoEnv } from "../hono/env";
import { getUserDO } from "../utils/do";

const auth = new Hono<HonoEnv>();

// logout
auth.post("/logout", async (c) => {
	deleteCookie(c, "token");
	deleteCookie(c, "refreshToken");
	return c.json({ message: "Logout successful" }, 200);
});

// verify
auth.get("/me", async (c) => {
	const result = await authenticated(c);

	if (result.ok) {
		const profile = (await result.do.get(USER_DO_KEYS.PROFILE)) as UserProfile;
		return c.json({ profile: profile }, 200);
	}

	return c.json(
		{ error: result.error, message: "Unauthorized token expired" },
		401,
	);
});

auth.post("/login", zValidator("json", LoginSchema), async (c) => {
	const data = c.req.valid("json");
	const { email, password } = data;
	const userDO = getUserDO(email);

	try {
		const { user, token, refreshToken } = await userDO.login({
			email,
			password,
		});

		// set token in cookie
		setCookiesAuth({
			c,
			name: "token",
			value: token,
		});

		// set refresh token in cookie
		setCookiesAuth({
			c,
			name: "refreshToken",
			value: refreshToken,
		});

		// return user data
		return c.json(
			{
				message: "Login successful",
				user: {
					id: user.id,
					email: user.email,
					createdAt: user.createdAt,
				},
			},
			200,
		);
	} catch (e: unknown) {
		if (e instanceof Error) {
			return c.json({ error: e.message }, 400);
		}

		return c.json({ error: "Login error" }, 400);
	}
});

auth.post(
	"/signup",
	zValidator(
		"json",
		UserSchema.pick({
			email: true,
			password: true,
			name: true,
		}).extend({
			confirmPassword: z
				.string()
				.min(8, "Password must be at least 8 characters"),
		}),
	),
	async (c) => {
		const data = c.req.valid("json");
		const { email, password, name, confirmPassword } = data;

		// confirm password is the same as confirmPassword
		if (password !== confirmPassword) {
			return c.json({ error: "Passwords do not match" }, 400);
		}

		// get userDO
		const userDO = getUserDO(email);

		try {
			// signup throws if user already exists
			await userDO.signup({ email, password });

			// set extra fields
			await userDO.set("profile", {
				id: Identifier.create("user"),
				name,
				type: "default",
				agents: [],
				email,
				createdAt: Date.now(),
			});

			return c.json({ message: "Signup successful" }, 200);
		} catch (e: unknown) {
			if (e instanceof Error) {
				return c.json({ error: e.message }, 400);
			}
			return c.json({ error: "Signup error" }, 400);
		}
	},
);

export default auth;
