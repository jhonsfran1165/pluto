import { type StandardSchemaV1, createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(["development", "production", "test", "preview"]).default("development"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  onValidationError: (issues: readonly StandardSchemaV1.Issue[]) => {
    console.error("❌ Invalid environment variables in NextJS:", issues)
    throw new Error("Invalid environment variables in NextJS")
  },
})
