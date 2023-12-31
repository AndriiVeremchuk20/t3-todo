"use client";

import { api } from "@/trpc/react";
import TaskForm from "./_components/task/form";
import TaskList from "./_components/task/list";
import Logo from "./_components/logo";

const Home = () => {
  const utils = api.useUtils();
  const [tasks] = api.task.getAll.useSuspenseQuery();

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
    <main className="flex min-h-screen flex-col  items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Logo />
      <div className="w-full sm:w-3/5">
        <TaskForm
          onSubmit={onCreateTask}
          isLoading={createTaskMutation.isLoading}
        />
        <TaskList tasks={tasks} />
      </div>
    </main>
  );
};

export default Home;
