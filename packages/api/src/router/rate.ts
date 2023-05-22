import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "../trpc";

export const rateRouter = createTRPCRouter({
  add: adminProcedure
    .input(
      z.object({
        exchangeRateId: z.string(),
        value: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rate = await ctx.prisma.rate.create({
        data: {
          ...input,
        },
      });
      if (!rate)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Error occured. Please try again",
        });
      return rate;
    }),
});
