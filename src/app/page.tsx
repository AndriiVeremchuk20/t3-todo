"use client";

import { api } from "@/trpc/react";
import TaskForm from "./_components/task/form";
import TaskList from "./_components/task/list";

const Home = () => {
  const utils = api.useUtils();
  const [tasks, _] = api.task.getAll.useSuspenseQuery();

  const createTaskMutation = api.task.create.useMutation({
    onSuccess: async (data) => {
      await utils.task.getAll.cancel();
      utils.task.getAll.setData(undefined, (old) => {
        const newArr = old ? [data, ...old] : [data];
        return newArr;
      });
    },
  });

  const onCreateTask = ({ text }: { text: string }) => {
    createTaskMutation.mutate({ text });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      Text
      <TaskForm
        onSubmit={onCreateTask}
        isLoading={createTaskMutation.isLoading}
      />
      <TaskList tasks={tasks} />
    </main>
  );
};

export default Home;
