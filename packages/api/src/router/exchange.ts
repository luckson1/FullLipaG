import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "../trpc";

export const exchangeRouter = createTRPCRouter({
  add: adminProcedure
    .input(
      z.object({
        rate: z.number(),
        source: z.string(),
        target: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.prisma.exchangeRate.create({
        data: {
          ...input,
        },
      });
      if (!payment)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Error occured. Please try again",
        });
      return payment;
    }),
});
