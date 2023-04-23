import { runCmd } from "./src/cmd.ts";
import { errorMessage } from "./src/utils/logs.ts";
import * as color from "https://deno.land/std@0.184.0/fmt/colors.ts";
import { getTasks } from "./src/utils/tasks.ts";

export async function drux(
  taskName: string | null,
  configFile: string | null = "deno.json",
) {
  try {
    const tasks = await getTasks(configFile) ?? null;
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
          console.log("   " + task?.toString());
        }
      }
    }
  } catch (error) {
    if (error instanceof Deno.errors.PermissionDenied) {
      console.error(
        errorMessage("Need `--allow-read` and `--allow-run` permissions."),
      );
    } else {
      throw error;
    }
  }
}
