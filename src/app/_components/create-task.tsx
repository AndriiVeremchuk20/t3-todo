"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";

export function CreateTask() {
  const router = useRouter();
  const [text, setText] = useState("");

  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setText("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createTask.mutate({ text });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createTask.isLoading}
      >
        {createTask.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
