import { exampleRouter } from "~/server/api/routers/example";
import { journalRouter } from "~/server/api/routers/journal";
import { chatRouter } from "~/server/api/routers/chat";
import { analysisRouter } from "~/server/api/routers/analysis";
import { endRequestRouter } from "~/server/api/routers/endRequest";
import { aiChatRouter } from "~/server/api/routers/aiChat";
import { noteRouter } from "~/server/api/routers/note";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  journal: journalRouter,
  chat: chatRouter,
  endRequest: endRequestRouter,
  analysis: analysisRouter,
  aiChat: aiChatRouter,
  note: noteRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
