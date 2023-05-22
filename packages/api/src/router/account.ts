import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const accountRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        accountNumber: z.string(),
        mobileWalletNumber: z.string(),
        bankName: z.string(),
        accountHolderName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const account = await ctx.prisma.account.create({
        data: {
          usersId,
          ...input,
        },
      });
      if (!account)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found. Please try again",
        });
      return account;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        accountNumber: z.string(),
        mobileWalletNumber: z.string(),
        bankName: z.string(),
        accountHolderName: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const account = await ctx.prisma.account.update({
        where: {
          id: input.id,
        },
        data: {
          usersId,
          ...input,
        },
      });
      if (!account)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found. Please try again",
        });
      return account;
    }),
  getAll: adminProcedure.query(async ({ ctx }) => {
    const accounts = await ctx.prisma.account.findMany();
    if (!accounts)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Accounts not found. Please try again",
      });
    return accounts;
  }),
  getOne: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await ctx.prisma.account.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return account;
    }),
  getUsersOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const account = await ctx.prisma.account.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (account.usersId !== usersId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not Authorised to view the account",
        });
      return account;
    }),
});
