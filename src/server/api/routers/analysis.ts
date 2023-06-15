import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getFallacyClassification,
  getToxicityLevel,
} from "../services/huggingface";
import { TRPCError } from "@trpc/server";

export const analysisRouter = createTRPCRouter({
  createAnalysis: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const chat = await ctx.prisma.chat.findFirst({
        where: {
          id: input.chatId,
          OR: [
            {
              creatorId: input.userId,
            },
            {
              joinerId: input.userId,
            },
          ],
        },
        include: {
          messages: true,
        },
      });

      if (!chat) {
        throw new Error("Chat not found");
      }

      for (const message of chat.messages) {
        try {
          const [classification, toxicity] = await Promise.all([
            getFallacyClassification({
              inputs: message.text,
            }),
            getToxicityLevel({
              inputs: message.text,
            }),
          ]);

          await ctx.prisma.message.update({
            where: {
              id: message.id,
            },
            data: {
              fallacyPrediction: classification?.label,
              fallacyScore: classification?.score,
              toxicityPrediction: toxicity?.label,
              toxicityScore: toxicity?.score,
            },
          });
        } catch (e) {
          console.error(e);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              "Something went wrong with the analysis. Please try again.",
          });
        }
      }
    }),
});
