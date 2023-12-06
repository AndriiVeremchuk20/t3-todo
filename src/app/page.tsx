"use client";

import { api } from "@/trpc/react";
import { CreateTask } from "./_components/create-task";
import TaskList from "./_components/task/list";

const Home = () => {
  const tasks = api.task.getAll.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      Text
      <CreateTask />
      {tasks.data && <TaskList tasks={tasks.data} />}
    </main>
  );
};

export default Home;
