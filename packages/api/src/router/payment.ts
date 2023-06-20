import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

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
        include: {
          ExchangeRate: true,
          rate: true,
        },
      });
      if (!payment)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Error occured. Please try again",
        });
      return payment;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        local: z.string(),
        foreign: z.string(),
        exchangeRateId: z.string(),
        rateId: z.string(),
        id: z.string(),
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
      const payment = await ctx.prisma.payment.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (payment.usersId !== usersId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorised to perform the action",
        });
      const editedPayment = await ctx.prisma.payment.update({
        where: {
          id: input.id,
        },
        data: {
          sentAmount,
          remittedAmount,
          exchangeRateId: input.exchangeRateId,
          rateId: input.rateId,
        },
        include: {
          ExchangeRate: true,
          rate: true,
        },
      });

      if (!editedPayment)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Error occured. Please try again",
        });
      return editedPayment;
    }),

  getTotalsByCurrency: adminProcedure.query(async ({ ctx }) => {
    const totalsByExchangeRateId = await ctx.prisma.payment.groupBy({
      by: ["exchangeRateId"],
      where: {
        Transaction: {
          some: {
            Status: {
              some: {
                name: "Received",
              },
            },
          },
        },
      },
      _sum: {
        sentAmount: true,
      },
    });

    const exchangeRateIds = totalsByExchangeRateId.map(
      (group) => group.exchangeRateId,
    );

    const exchangeRates = await ctx.prisma.exchangeRate.findMany({
      where: {
        id: {
          in: exchangeRateIds,
        },
      },
      select: {
        id: true,
        target: true,
      },
    });

    const totalsByCurrency = totalsByExchangeRateId.map((group) => {
      const exchangeRateId = group.exchangeRateId;
      const sentAmount = group._sum.sentAmount;

      const exchangeRate = exchangeRates.find(
        (rate) => rate.id === exchangeRateId,
      );
      const targetCurrency = exchangeRate?.target;

      return {
        exchangeRateId,
        sentAmount,
        targetCurrency,
      };
    });

    return totalsByCurrency;
  }),

  getUsersOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log(input.id);
      const usersId = ctx.user.id;
      const payment = await ctx.prisma.payment.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (payment.usersId !== usersId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only the author can edit this payment",
        });
      }

      return payment;
    }),
});
