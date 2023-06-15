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

      try {
        console.log(chat.messages.map((message) => message.text));
        const [classification, toxicity] = await Promise.all([
          getFallacyClassification(
            {
              inputs: chat.messages.map((message) => message.text),
            },
            0.1
          ),
          getToxicityLevel({
            inputs: chat.messages.map((message) => message.text),
          }),
        ]);

        console.log(classification, toxicity);

        if (!classification || !toxicity) {
          throw new Error("Something went wrong with the analysis");
        }

        await ctx.prisma.$transaction(
          classification
            .map((c, idx) =>
              ctx.prisma.message.update({
                where: {
                  id: chat.messages[idx]?.id,
                },
                data: {
                  fallacyPrediction: c?.label,
                  fallacyScore: c?.score,
                },
              })
            )
            .concat(
              toxicity.map((t, idx) =>
                ctx.prisma.message.update({
                  where: {
                    id: chat.messages[idx]?.id,
                  },
                  data: {
                    toxicityPrediction: t?.label,
                    toxicityScore: t?.score,
                  },
                })
              )
            )
        );
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong with the analysis. Please try again.",
        });
      }
    }),
});
