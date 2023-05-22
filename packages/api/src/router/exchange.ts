import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "../trpc";

export const exchangeRouter = createTRPCRouter({
  add: adminProcedure
    .input(
      z.object({
        source: z.string(),
        target: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exchangeRate = await ctx.prisma.exchangeRate.create({
        data: {
          ...input,
        },
      });
      if (!exchangeRate)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Error occured. Please try again",
        });
      return exchangeRate;
    }),
});
