import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

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
  getLatestRates: publicProcedure.query(async ({ ctx }) => {
    const rates = await ctx.prisma.exchangeRate.findMany({
      include: {
        Rate: {
          select: {
            value: true,
          },
          orderBy: {
            timestamp: "asc",
          },
          take: 1,
        },
      },
    });
    if (!rates)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No rates found. Try again",
      });
    return rates;
  }),
  getLatestRate: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const rates = await ctx.prisma.exchangeRate.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          Rate: {
            select: {
              value: true,
            },
            orderBy: {
              timestamp: "asc",
            },
            take: 1,
          },
        },
      });
      return rates;
    }),
});
