import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paymentRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        local: z.string(),
        foreign: z.string(),
        exchangeRateId: z.string(),
        rateId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sentAmount = parseFloat(input.foreign);
      const remittedAmount = parseFloat(input.local);

      if (Number.isNaN(sentAmount) || Number.isNaN(remittedAmount))
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Invalid amounts, please try again",
        });

      const usersId = ctx.user.id;
      const payment = await ctx.prisma.payment.create({
        data: {
          sentAmount,
          remittedAmount,
          exchangeRateId: input.exchangeRateId,
          rateId: input.rateId,
          usersId,
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
