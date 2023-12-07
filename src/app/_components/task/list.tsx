import { type Task } from "@prisma/client";
import { type FC } from "react";
import TaskItem from "./item";

interface PropsTaskList {
  tasks: Task[];
}

const TaskList: FC<PropsTaskList> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="m-3 text-center text-xl opacity-50">
        Create first task
      </div>
    );
  }
  return (
    <div className="m-3 divide-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
