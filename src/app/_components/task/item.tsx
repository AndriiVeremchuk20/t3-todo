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
    editTaskMutation.mutate({ id: task.id, text });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Modal>
        <TaskForm
          onSubmit={onUpdateTaskSubmit}
          isLoading={editTaskMutation.isLoading}
          defaultValue={task.text}
        />
      </Modal>
    );
  }

  return (
    <div>
      <div>
        <input
          type="checkbox"
          defaultChecked={task.status}
          onChange={onUpdateStatusClick}
        />
        <div>{task.text}</div>
        <div>
          <button onClick={editClickHandler}>
            <AiOutlineEdit />
          </button>
          <button onClick={deleteClickHandler}>
            <AiOutlineDelete />
          </button>
        </div>
      </div>
      <div>
        {task.updatedAt === task.createdAt
          ? `Updated: ${task.updatedAt.toLocaleDateString()}`
          : null}
        {`Created: ${task.createdAt.toLocaleDateString()}`}
      </div>
    </div>
  );
};

export default TaskItem;
