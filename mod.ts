import * as path from "path";
import { projectFile, runCmd } from "./src/utils.ts";

export async function drux(taskName: string) {
  const projectFilePath = path.join(Deno.cwd(), "./project.yml");
  const projectFileContent = await projectFile(projectFilePath);
  const tasks = projectFileContent?.tasks ?? null;
  if (!!taskName && !!tasks) {
    const task = tasks[taskName];
    if (task) {
      await runCmd(task.split(" "), Deno.cwd());
    }
  }
}