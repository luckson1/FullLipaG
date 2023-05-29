import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1, { message: "First name is required" }),
        lastName: z.string().min(1, { message: "Last name is required" }),
        gender: z.enum(["Male", "Female"]),
        email: z.string().email().nonempty({ message: "Email required" }),
        governmentId: z
          .string()
          .min(1, { message: "Government ID is required" }),
        dateOfBirth: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const profile = await ctx.prisma.profile.create({
        data: {
          userId,
          ...input,
        },
      });
      return profile;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1, { message: "First name is required" }),
        lastName: z.string().min(1, { message: "Last name is required" }),
        email: z.string().email().nonempty({ message: "Email required" }),
        gender: z.enum(["Male", "Female"]),
        governmentId: z
          .string()
          .min(1, { message: "Government ID is required" }),
        dateOfBirth: z.date(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const profile = await ctx.prisma.profile.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (profile.userId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only the profile owner is allowed to edit this profile",
        });
      }
      const editedProfile = await ctx.prisma.profile.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
      return editedProfile;
    }),
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.user.id;
    const userProfile = await ctx.prisma.users.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,

        Profile: true,
        Transaction: {
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
        },
      },
    });
    if (!userProfile)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: " An Error has occurred",
      });
    return userProfile;
  }),
});
