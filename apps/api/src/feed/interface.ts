import { z } from "zod";

export const getFeedRequestSchema = z.object({
	projectId: z.string(),
});
export type GetFeedRequest = z.infer<typeof getFeedRequestSchema>;

export const getFeedResponseSchema = z.object({
	feed: z.array(z.any()),
});
export type GetFeedResponse = z.infer<typeof getFeedResponseSchema>;
