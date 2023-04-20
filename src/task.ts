import { getTaskName } from "./utils.ts";

export const getTaskIndex = (
  tasks: { [key: string]: string }[] | null,
): number => {
  if (tasks !== null) {
    const taskName = getTaskName();
    const taskIndex = tasks.findIndex((task: { [key: string]: string }) => {
      return !!task[taskName];
    });
    return taskIndex;
  }
  return 0;
};
