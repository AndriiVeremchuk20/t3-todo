import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.task.findMany();
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          text: input.text,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const mbTask = await ctx.db.task.findUnique({ where: { id } });

      if (!mbTask) {
        throw new TRPCError({ code: "NOT_FOUND", message: "task not found" });
      }
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, text } = input;
      return await ctx.db.task.update({ where: { id }, data: { text } });
    }),

  updateStatus: publicProcedure
    .input(z.object({ id: z.string(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;
      return await ctx.db.task.update({ where: { id }, data: { status } });
    }),
});
