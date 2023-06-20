import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const statusRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        name: z.enum([
          "Initiated",
          "Cancelled",
          "Paused",
          "Processing",
          "Processed",
          "Sent",
          "Received",
        ]),
        transactionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const status = await ctx.prisma.status.create({
        data: {
          transactionId: input.transactionId,
          name: input.name,
        },
      });
      return status;
    }),
});
