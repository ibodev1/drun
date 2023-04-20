import { projectFile, runCmd } from "./src/utils.ts";

export async function drux(taskName: string) {
  try {
    const projectFilePath = await Deno.realPath("project.yml");
    const projectFileContent = await projectFile(projectFilePath);
    const tasks = projectFileContent?.tasks ?? null;
    if (!!taskName && !!tasks) {
      const task = tasks[taskName];
      if (task && task.trim() !== "") {
        await runCmd(task.split(" "), Deno.cwd());
      }
    }
  } catch (error) {
    if (error instanceof Deno.errors.PermissionDenied) {
      throw new Error("Need `--allow-read` and `--allow-run` permissions.");
    } else {
      throw error;
    }
  }
}
