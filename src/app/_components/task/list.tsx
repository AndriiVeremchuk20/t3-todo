import { type Task } from "@prisma/client";
import { type FC } from "react";
import TaskItem from "./item";

interface PropsTaskList {
  tasks: Task[];
}

const TaskList: FC<PropsTaskList> = ({ tasks }) => {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
