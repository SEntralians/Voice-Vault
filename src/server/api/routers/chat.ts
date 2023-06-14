import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { validateChatLimit } from "../middlewares/chat";
import { EXPIRATION_TIME } from "../constants";
import { TRPCError } from "@trpc/server";
import { getFallacyClassification } from "../services/huggingface";

export const chatRouter = createTRPCRouter({
  getChat: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.chat.findUnique({
        where: {
          id: input.id,
        },
        include: {
          creator: true,
          joiner: true,
        },
      });
    }),
  getMessages: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.message.findMany({
        where: {
          chatId: input.id,
        },
      });
    }),
  createChat: protectedProcedure
    .input(
      z.object({
        leftTopic: z.string().min(1).max(50),
        rightTopic: z.string().min(1).max(50),
        description: z.string().min(1).max(200),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.chat.create({
        data: {
          leftTopic: input.leftTopic,
          rightTopic: input.rightTopic,
          description: input.description,
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          expiresAt: new Date(Date.now() + EXPIRATION_TIME),
          status: "PENDING",
        },
      });
    }),

  joinChat: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // validate user is not the creator
      const chat = await ctx.prisma.chat.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      if (chat.creatorId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot join your own chat",
        });
      }

      return ctx.prisma.chat.update({
        where: {
          id: input.id,
        },
        data: {
          joiner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          status: "ACCEPTED",
        },
      });
    }),

  startChat: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        joinerSelectedTopic: z.string().min(1).max(50),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // validate that there is a creator and joiner
      const chat = await ctx.prisma.chat.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      if (!chat.creatorId || !chat.joinerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chat is not ready to start",
        });
      }

      // validate that user id is joiner's id
      if (chat.joinerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not the joiner of this chat",
        });
      }

      // validate that joiner topic is one of the two topics
      if (
        chat.leftTopic !== input.joinerSelectedTopic &&
        chat.rightTopic !== input.joinerSelectedTopic
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Joiner topic is not one of the two topics",
        });
      }

      const creatorSelectedTopic =
        chat.leftTopic === input.joinerSelectedTopic
          ? chat.rightTopic
          : chat.leftTopic;

      return ctx.prisma.chat.update({
        where: {
          id: input.id,
        },
        data: {
          status: "ON_GOING",
          joinerSelectedTopic: input.joinerSelectedTopic,
          creatorSelectedTopic,
        },
      });
    }),
  sendMessage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        message: z.string().min(1).max(200),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await validateChatLimit(ctx, input.id);

      const fallacyResult = await getFallacyClassification({
        inputs: input.message,
      });

      // get turn
      const chat = await ctx.prisma.chat.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      const role =
        chat.creatorId === ctx.session.user.id ? "CREATOR" : "JOINER";
      const currentTurn = chat.chatTurn;

      if (role !== currentTurn) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not your turn",
        });
      }

      // create message
      await ctx.prisma.chat.update({
        where: {
          id: input.id,
        },
        data: {
          chatTurn: role === "CREATOR" ? "JOINER" : "CREATOR",
          messages: {
            create: {
              text: input.message,
              type: role,
              fallacyPrediction: fallacyResult?.label,
              fallacyScore: fallacyResult?.score,
            },
          },
        },
      });

      await validateChatLimit(ctx, input.id);
    }),
});
