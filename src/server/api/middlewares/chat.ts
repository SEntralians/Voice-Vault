import { TRPCError } from "@trpc/server";
import { MESSAGE_LIMIT } from "~/constants";

import type { Context } from "~/server/api/trpc";

export const validateChatLimit = async (ctx: Context, id: string) => {
  const messages = await ctx.prisma.message.findMany({
    where: {
      chatId: id,
    },
  });

  if (!messages) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chat not found",
    });
  }

  const isValid = messages.length < MESSAGE_LIMIT;

  if (!isValid) {
    await ctx.prisma.chat.update({
      where: {
        id,
      },
      data: {
        status: "DONE",
      },
    });
  }
};
