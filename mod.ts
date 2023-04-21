import { denoFile, runCmd } from "./src/utils.ts";

export async function drux(taskName: string) {
  try {
    const denoFilePath = await Deno.realPath("deno.json");
    const denoFileContent = await denoFile(denoFilePath);
    const tasks = denoFileContent?.tasks ?? null;
    if (!!taskName && !!tasks) {
      const task = tasks[taskName];
      if (task && task.trim() !== "") {
        await runCmd(task.split(" "), Deno.cwd());
      }
    }
  } catch (error) {
    if (error instanceof Deno.errors.PermissionDenied) {
      throw new Error("Need `--allow-read` and `--allow-run` permissions.");
    } else if (error instanceof Deno.errors.NotFound) {
      throw new Error("deno.json does not exist in root directory.");
    } else {
      throw error;
    }
  }
}
