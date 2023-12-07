"use client";

import { type FC } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

interface FormValues {
  text: string;
}

interface PropsTaskForm {
  defaultValue?: string;
  onSubmit: ({ text }: { text: string }) => void;
  isLoading: boolean;
}

const TaskForm: FC<PropsTaskForm> = ({ defaultValue, onSubmit, isLoading }) => {
  const { register, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: { text: defaultValue ?? "" },
  });

  const onFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit({ text: data.text });
    setValue("text", "");
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex gap-2 rounded-full border bg-violet-600 p-1"
    >
      <input
        type="text"
        placeholder="Task"
        className="w-full rounded-full px-4 py-2 text-black"
        {...register("text", { maxLength: 250 })}
      />
      <button
        type="submit"
        className="rounded-full border bg-white/40 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default TaskForm;
