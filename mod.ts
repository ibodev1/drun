import * as path from "path";
import { projectFile, runCmd } from "./src/utils.ts";
import { getTaskIndex } from "./src/task.ts";

export async function drux(taskName: string) {
  const projectFilePath = path.join(Deno.cwd(), "./project.yml");
  const projectFileContent = await projectFile(projectFilePath);
  const tasks = projectFileContent?.tasks ?? null;
  if (!!taskName && !!tasks) {
    const taskIndex = getTaskIndex(tasks);
    if (taskIndex >= 0) {
      const task = tasks[taskIndex][taskName];
      await runCmd(task.split(" "), Deno.cwd());
    }
  }
}
