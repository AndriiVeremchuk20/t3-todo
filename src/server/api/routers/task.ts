import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { text } = input;
      const newTask = await ctx.db.task.create({
        data: {
          text: text,
        },
      });

      return newTask;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const mbTask = await ctx.db.task.findUnique({ where: { id } });

      if (!mbTask) {
        throw new TRPCError({ code: "NOT_FOUND", message: "task not found" });
      }

      const deletedTask = await ctx.db.task.delete({ where: { id } });
      return { id: deletedTask.id };
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
