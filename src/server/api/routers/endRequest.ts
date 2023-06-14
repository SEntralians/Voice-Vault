import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";

export const endRequestRouter = createTRPCRouter({
  getPendingEndRequests: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        chatId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.endRequest.findMany({
        where: {
          NOT: {
            userId: input.userId,
          },
          chatId: input.chatId,
          status: "PENDING",
        },
      });
    }),

  getIfUserHasOffered: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        chatId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const endRequest = await ctx.prisma.endRequest.findFirst({
        where: {
          userId: input.userId,
          chatId: input.chatId,
        },
      });

      if (!endRequest) {
        return false;
      }

      return !!endRequest;
    }),

  offer: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        chatId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // throw error if user has already ended request
      const endRequest = await ctx.prisma.endRequest.findFirst({
        where: {
          userId: input.userId,
          chatId: input.chatId,
        },
      });

      if (endRequest) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have already ended this request",
        });
      }

      return ctx.prisma.endRequest.create({
        data: {
          chat: {
            connect: {
              id: input.chatId,
            },
          },
          user: {
            connect: {
              id: input.userId,
            },
          },
          status: "PENDING",
        },
      });
    }),

  answer: protectedProcedure
    .input(
      z.object({
        answer: z.enum(["ACCEPTED", "REJECTED"]),
        chatId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const endRequest = await ctx.prisma.endRequest.findFirst({
        where: {
          NOT: {
            userId: input.userId,
          },
          chatId: input.chatId,
        },
      });

      if (!endRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "End request not found",
        });
      }

      return ctx.prisma.endRequest.update({
        where: {
          id: endRequest.id,
        },
        data: {
          status: input.answer,
          chat: {
            update: {
              status: input.answer === "ACCEPTED" ? "DONE" : undefined,
            },
          },
        },
      });
    }),
});
