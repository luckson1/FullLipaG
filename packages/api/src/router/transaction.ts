import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const transactionRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        recipientId: z.string(),
        paymentId: z.string(),
        status: z.enum(["Initiated"]),
        paymentMethod: z.enum(["Wallet", "PesaLink", "Manual_wire_transfer"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const payment = await ctx.prisma.transaction.create({
        data: {
          paymentId: input.paymentId,
          recipientId: input.recipientId,
          paymentMethod: input.paymentMethod,
          usersId,
          Status: {
            create: {
              name: input.status,
            },
          },
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
        paymentMethod: z.enum(["Wallet", "PesaLink", "Manual_wire_transfer"]),
        paymentId: z.string(),
        bankReferenceNumber: z.string().nullable(),
        id: z.string(),
        status: z.enum([
          "Initiated",
          "To_Confirm",
          "Processing",
          "Declined",
          "Sent",
          "Received",
          "Cancelled",
          "Paused",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const product = await ctx.prisma.transaction.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (product.usersId !== usersId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorised to perform this action",
        });
      const editedPayment = await ctx.prisma.transaction.update({
        where: {
          id: input.id,
        },
        data: {
          bankReferenceNumber: input.bankReferenceNumber,
          paymentMethod: input.paymentMethod,
          paymentId: input.paymentId,
          usersId,

          Status: {
            create: {
              name: input.status,
            },
          },
        },
      });

      if (!editedPayment)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Error occured. Please try again",
        });
      return editedPayment;
    }),
  addBankRef: protectedProcedure
    .input(
      z.object({
        bankReferenceNumber: z.string().nullable(),
        id: z.string(),
        status: z.enum(["Processing"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const product = await ctx.prisma.transaction.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (product.usersId !== usersId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorised to perform this action",
        });
      const editedPayment = await ctx.prisma.transaction.update({
        where: {
          id: input.id,
        },
        data: {
          bankReferenceNumber: input.bankReferenceNumber,
          usersId,

          Status: {
            create: {
              name: input.status,
            },
          },
        },
      });

      if (!editedPayment)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An Error occured. Please try again",
        });
      return editedPayment;
    }),
  getAll: adminProcedure.query(async ({ ctx }) => {
    const transactions = await ctx.prisma.transaction.findMany();
    if (!transactions)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Transactions not found.",
      });
    return transactions;
  }),
  getOne: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (!transaction)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found. Please try again",
        });
      return transaction;
    }),
  getUsersAll: protectedProcedure.query(async ({ ctx }) => {
    const usersId = ctx.user.id;
    const transactions = await ctx.prisma.transaction.findMany({
      where: {
        usersId,
      },

      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        Status: {
          orderBy: {
            createdAt: "desc",
          },
        },
        recipient: {
          select: {
            name: true,
          },
        },
        payment: {
          select: {
            sentAmount: true,
            ExchangeRate: {
              select: {
                target: true,
              },
            },
          },
        },
      },
    });
    if (!transactions)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Transactions not found.",
      });
    return transactions;
  }),
  getUsersFirstTwo: protectedProcedure.query(async ({ ctx }) => {
    const usersId = ctx.user.id;
    const transactions = await ctx.prisma.transaction.findMany({
      where: {
        usersId,
      },

      orderBy: {
        createdAt: "desc",
      },
      take: 2,
      select: {
        id: true,
        Status: {
          orderBy: {
            createdAt: "desc",
          },
        },
        recipient: {
          select: {
            name: true,
          },
        },
        payment: {
          select: {
            sentAmount: true,
            ExchangeRate: {
              select: {
                target: true,
              },
            },
          },
        },
      },
    });
    if (!transactions)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Transactions not found.",
      });
    return transactions;
  }),
  getUsersOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const transaction = await ctx.prisma.transaction.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          recipient: true,
          Status: true,
          payment: {
            include: {
              rate: true,
              ExchangeRate: true,
            },
          },
        },
      });
      if (transaction.usersId !== usersId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not Authorised to view the transaction",
        });
      return transaction;
    }),
});
