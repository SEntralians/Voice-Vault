import { TRPCError } from "@trpc/server";

import type { Context } from "~/server/api/trpc";

export const validateJournalOwnership = async (ctx: Context, id: string) => {
  const journal = await ctx.prisma.journal.findFirst({
    where: {
      id,
      userId: ctx.session?.user.id,
    },
  });

  if (!journal) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Journal not found",
    });
  }

  return journal;
};
