import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { THERAPEUTIC_CHAT_INFO } from "../constants";
import { covnverseWithChatGpt } from "../services/openai";

export const aiChatRouter = createTRPCRouter({
  getAiConversations: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await ctx.prisma.aIChat
      .findUnique({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          conversations: true,
        },
      })
      .then((aiChat) => aiChat?.conversations);

    return conversations ?? [];
  }),
  chatAi: protectedProcedure
    .input(z.object({ userInput: z.string().min(1).max(2000) }))
    .mutation(async ({ input, ctx }) => {
      const systemInformation = THERAPEUTIC_CHAT_INFO;

      const aiChat = await ctx.prisma.aIChat.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          conversations: true,
        },
      });

      if (aiChat) {
        const historyConversations = aiChat.conversations.map(
          (conversation) => ({
            userInput: conversation.userInput,
            aiReply: conversation.aiReply,
          })
        );

        const aiReply = await covnverseWithChatGpt(
          systemInformation,
          historyConversations,
          input.userInput
        );

        return ctx.prisma.aIChat.update({
          where: {
            id: aiChat.id,
          },
          data: {
            conversations: {
              create: {
                userInput: input.userInput,
                aiReply: aiReply ?? "Sorry, I don't understand.",
              },
            },
          },
        });
      }

      return ctx.prisma.aIChat.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          systemInformation: systemInformation,
        },
      });
    }),
});
