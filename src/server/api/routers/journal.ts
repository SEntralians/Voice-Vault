import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { validateJournalOwnership } from "../middlewares/journal";

export const journalRouter = createTRPCRouter({
  getUserJournals: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.journal.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getJournal: protectedProcedure
    .input(z.object({ id: z.string().nullable() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      if (!id) return null;

      await validateJournalOwnership(ctx, id);

      return ctx.prisma.journal.findUnique({
        where: {
          id,
        },
      });
    }),
  createJournal: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.journal.create({
        data: {
          title: input.title,
          description: input.description,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  updateJournal: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await validateJournalOwnership(ctx, input.id);

      return ctx.prisma.journal.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
        },
      });
    }),
  deleteJournal: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )

    .mutation(async ({ input, ctx }) => {
      await validateJournalOwnership(ctx, input.id);

      return ctx.prisma.journal.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
