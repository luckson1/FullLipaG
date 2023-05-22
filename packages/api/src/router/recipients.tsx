import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const recipientROuter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        bankName: z.string(),
        bankCountry: z.string(),
        swiftCode: z.string(),
        bankAccount: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const recipient = await ctx.prisma.recipient.create({
        data: {
          ...input,
          usersId,
        },
      });
      if (!recipient)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Error occured. Please try again",
        });
      return recipient;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        bankName: z.string(),
        bankCountry: z.string(),
        swiftCode: z.string(),
        bankAccount: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const recipientToEdit = await ctx.prisma.recipient.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (recipientToEdit.usersId !== usersId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only the author is allowed to edit the recipient",
        });
      }
      const editedRecipient = await ctx.prisma.recipient.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
      if (!editedRecipient)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Error occured. Please try again",
        });
      return editedRecipient;
    }),
  getAll: adminProcedure.query(async ({ ctx }) => {
    const recipients = await ctx.prisma.recipient.findMany();
    if (!recipients)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Recipients not found. Please try again",
      });
    return recipients;
  }),
  getOne: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const recipient = await ctx.prisma.recipient.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return recipient;
    }),
  getUsersAll: protectedProcedure.query(async ({ ctx }) => {
    const usersId = ctx.user.id;
    const recipients = await ctx.prisma.recipient.findMany({
      where: {
        usersId,
      },
    });
    if (!recipients)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Recipients not found. Please try again",
      });
    return recipients;
  }),
  getUsersOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const recipient = await ctx.prisma.recipient.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (recipient.usersId !== usersId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not Authorised to view the recipient",
        });
      return recipient;
    }),
});
