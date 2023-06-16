import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getFallacyClassification,
  getToxicityLevel,
} from "../services/huggingface";
import { TRPCError } from "@trpc/server";
import { formatToDialogue } from "~/server/api/helpers";
import { askChatGpt } from "~/server/api/services/openai";

export const analysisRouter = createTRPCRouter({
  getChatAnalysis: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.chat.findUnique({
        where: {
          id: input.id,
        },
        select: {
          analysis: true,
        },
      });
    }),
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
        select: {
          creator: {
            select: {
              name: true,
            },
          },
          joiner: {
            select: {
              name: true,
            },
          },
          messages: {
            select: {
              id: true,
              text: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          creatorSelectedTopic: true,
          joinerSelectedTopic: true,
          description: true,
        },
      });

      if (!chat) {
        throw new Error("Chat not found");
      }

      const formattedMessages = chat.messages.map((message) => ({
        text: message.text,
        user: message.user.name,
      }));

      const dialogue = formatToDialogue(formattedMessages);
      const creatorName = chat.creator.name;
      const joinerName = chat.joiner?.name;
      const creatorSelectedTopic = chat.creatorSelectedTopic;
      const joinerSelectedTopic = chat.joinerSelectedTopic;

      const message = `I want you to analyze the debate conversation. The details are, ${
        creatorName ?? "Person A"
      } is for the ${creatorSelectedTopic ?? "Topic A"} and ${
        joinerName ?? "Person B"
      } is for ${joinerSelectedTopic ?? "Topic B"} where the details are ${
        chat.description
      }. The following dialogue is that ${dialogue}.`;

      const analysisPrompt =
        message +
        "Can you please give me detailed information for each debater regarding their relevance to the topic, factual information, organization, clarity";

      try {
        const [classification, toxicity, analsyis] = await Promise.all([
          getFallacyClassification({
            inputs: chat.messages.map((message) => message.text),
          }),
          getToxicityLevel({
            inputs: chat.messages.map((message) => message.text),
          }),
          askChatGpt(analysisPrompt),
        ]);

        if (!classification || !toxicity) {
          throw new Error("Something went wrong with the analysis");
        }

        await ctx.prisma.$transaction([
          ...classification.map((c, idx) =>
            ctx.prisma.message.update({
              where: {
                id: chat.messages[idx]?.id,
              },
              data: {
                fallacyPrediction: c?.label,
                fallacyScore: c?.score,
              },
            })
          ),
          ...toxicity.map((t, idx) =>
            ctx.prisma.message.update({
              where: {
                id: chat.messages[idx]?.id,
              },
              data: {
                toxicityPrediction: t?.label,
                toxicityScore: t?.score,
              },
            })
          ),
          ctx.prisma.chat.update({
            where: {
              id: input.chatId,
            },
            data: {
              analysis: analsyis,
            },
          }),
        ]);
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong with the analysis. Please try again.",
        });
      }
    }),
});
