import { type Task } from "@prisma/client";
import { type FC } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

interface PropsTaskItem {
  task: Task;
}

const TaskItem: FC<PropsTaskItem> = ({ task }) => {
  return (
    <div>
      <div>
        <input type="checkbox" defaultChecked={task.status} />
        <div>{task.text}</div>
        <div>
          <button>
            <AiOutlineEdit />
          </button>
          <button>
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
