import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { EXPIRATION_TIME } from "../constants";

export const chatRouter = createTRPCRouter({
  getChat: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
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
          status: "ON_GOING",
        },
      });
    }),
});
