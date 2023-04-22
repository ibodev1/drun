import { denoFile, runCmd } from "./src/utils.ts";
import { errorMessage } from "./src/logs.ts";
import * as color from "https://deno.land/std@0.184.0/fmt/colors.ts";

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
    } else {
      if (tasks && Array.isArray(Object.entries(tasks))) {
        console.info(color.green("DRux Available tasks:"));
        const entries = Object.entries(tasks) ?? [];
        for (let i = 0; i < entries.length; i++) {
          const key = entries[i][0];
          const task = entries[i][1];
          console.info("- " + color.cyan(key.toString()));
          console.log("   " + task?.toString())
        }
      }
    }
  } catch (error) {
    if (error instanceof Deno.errors.PermissionDenied) {
      console.error(
        errorMessage("Need `--allow-read` and `--allow-run` permissions."),
      );
    } else if (error instanceof Deno.errors.NotFound) {
      console.error(
        errorMessage("deno.json does not exist in root directory."),
      );
    } else {
      throw error;
    }
  }
}
