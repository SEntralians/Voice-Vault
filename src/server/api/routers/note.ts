import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  getAllNotes: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany();
  }),
  createNote: protectedProcedure
    .input(z.object({ content: z.string().min(1).max(700) }))
    .mutation(({ input, ctx }) => {
      const { content } = input;

      return ctx.prisma.note.create({
        data: {
          content,
        },
      });
    }),
});
