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
  const defaultVal = defaultValue ?? "";
  const { register, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: { text: defaultVal },
  });

  const onFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit({ text: data.text });
    setValue("text", "");
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Task"
        className="w-full rounded-full px-4 py-2 text-black"
        {...register("text")}
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default TaskForm;
