import { api } from "@/trpc/react";
import { type Task } from "@prisma/client";
import { type FC, type ChangeEvent, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import Modal from "../modal";
import TaskForm from "./form";

interface PropsTaskItem {
  task: Task;
}

const TaskItem: FC<PropsTaskItem> = ({ task }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const utils = api.useUtils();

  const onDeleteMutation = api.task.delete.useMutation({
    onMutate: async ({ id }) => {
      await utils.task.getAll.cancel();
      utils.task.getAll.setData(undefined, (old) => {
        return old?.filter((t) => t.id !== id);
      });
    },
  });

  const updateStatusMutation = api.task.updateStatus.useMutation({
    onMutate: async (updatedTask) => {
      await utils.task.getAll.cancel();
      utils.task.getAll.setData(undefined, (old) => {
        return old?.map((t) => {
          if (t.id === updatedTask.id) {
            return { ...t, status: updatedTask.status };
          }
          return t;
        });
      });
    },
  });

  const editTaskMutation = api.task.update.useMutation({
    onSuccess: async (editedTask) => {
      await utils.task.getAll.cancel();
      utils.task.getAll.setData(undefined, (old) => {
        return old?.map((t) => {
          if (t.id === editedTask.id) {
            return editedTask;
          }
          return t;
        });
      });
    },
  });

  const deleteClickHandler = () => {
    onDeleteMutation.mutate({ id: task.id });
  };

  const onUpdateStatusClick = (e: ChangeEvent<HTMLInputElement>) => {
    updateStatusMutation.mutate({ id: task.id, status: e.target.checked });
  };

  const editClickHandler = () => {
    setIsEditing((prev) => !prev);
  };

  const onUpdateTaskSubmit = ({ text }: { text: string }) => {
    if(text===task.text){
    editTaskMutation.mutate({ id: task.id, text });
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Modal>
        <div className="w-3/4">
          <TaskForm
            onSubmit={onUpdateTaskSubmit}
            isLoading={editTaskMutation.isLoading}
            defaultValue={task.text}
          />
        </div>
      </Modal>
    );
  }

  return (
    <div className="w-full p-2 hover:bg-white/10">
      <div className="grid w-full grid-cols-6 gap-x-2">
        <input
          type="checkbox"
          defaultChecked={task.status}
          onChange={onUpdateStatusClick}
          className="w-[30px]"
        />
        <div className="col-span-4 break-all">{task.text}</div>
        <div className="space-x-2 text-xl">
          <button
            onClick={editClickHandler}
            title="Edit task"
            className="p-1 duration-100 hover:rounded-full hover:bg-white/40"
          >
            <AiOutlineEdit />
          </button>
          <button
            onClick={deleteClickHandler}
            title="Delete task"
            className="p-1 duration-100 hover:rounded-full hover:bg-white/40"
          >
            <AiOutlineDelete />
          </button>
        </div>
      </div>
      <div className="m-1 flex justify-end p-1">
        <span className="flex flex-col bg-neutral-300 bg-opacity-40 px-2">
          {task.updatedAt.toLocaleString() ===
          task.createdAt.toLocaleString() ? (
            `Updated: ${task.updatedAt.toLocaleString()}`
          ) : (
            `${task.createdAt.toLocaleString()}`
          )}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;
