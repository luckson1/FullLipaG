import { TRPCError } from "@trpc/server";
import { endOfMonth, format, startOfMonth } from "date-fns";
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
  cancel: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const usersId = ctx.user.id;
      const product = await ctx.prisma.transaction.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          Status: true,
        },
      });
      if (product.usersId !== usersId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorised to perform this action",
        });
      const isLateCancellation = product.Status.some(
        (status) =>
          status.name === "Processed" ||
          status.name === "Sent" ||
          status.name === "Received",
      );
      if (isLateCancellation)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Too late! Transaction cannot be cancelled at this stage.",
        });
      const editedPayment = await ctx.prisma.transaction.update({
        where: {
          id: input.id,
        },
        data: {
          Status: {
            create: {
              name: "Cancelled",
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
              name: "Processing",
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
  getTransactionsMadeThisMonth: adminProcedure.query(async ({ ctx }) => {
    const currentDate = new Date();
    const startOfMonthDate = startOfMonth(currentDate);
    const endOfMonthDate = endOfMonth(currentDate);

    const countReceivedTransactionsThisMonth =
      await ctx.prisma.transaction.count({
        where: {
          Status: {
            some: {
              name: "Received",
            },
          },
          createdAt: {
            gte: startOfMonthDate,
            lte: endOfMonthDate,
          },
        },
      });

    return countReceivedTransactionsThisMonth;
  }),
  getRecentTransactions: protectedProcedure.query(async ({ ctx }) => {
    const mostRecentCompletedTransactions =
      await ctx.prisma.transaction.findMany({
        where: {
          Status: {
            some: {
              name: "Received",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          createdAt: true,
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
          user: {
            select: {
              phone: true,
              Profile: {
                select: {
                  lastName: true,
                  firstName: true,
                  image: true,
                },
              },
            },
          },
        },
      });
    return mostRecentCompletedTransactions;
  }),
  getSuccessfulTransactionsPerMonth: protectedProcedure.query(
    async ({ ctx }) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      const data = [];

      for (let month = 0; month < 12; month++) {
        const startDate = startOfMonth(new Date(currentYear, month, 1));
        const endDate = endOfMonth(new Date(currentYear, month, 1));

        const totalSentAmount = await ctx.prisma.payment.aggregate({
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
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            remittedAmount: true,
          },
        });

        const monthName = format(startDate, "MMM");

        data.push({
          name: monthName,
          total: totalSentAmount._sum.remittedAmount || 0,
        });
      }

      return data;
    },
  ),
});
