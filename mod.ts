import { runCmd } from "./src/cmd.ts";
import { errorMessage } from "./src/utils/logs.ts";
import { getTasks } from "./src/utils/tasks.ts";
import { availableTasks } from './src/utils/logs.ts';

export async function drux(
  taskName: string | null,
  configFile: string | null = "deno.json",
) {
  try {
    const { tasks, fileName } = await getTasks(configFile);
    console.log(fileName);
    if (!!taskName && !!tasks) {
      const task = tasks[taskName];
      if (task && task.trim() !== "") {
        await runCmd(task.split(" "), Deno.cwd());
      } else {
        availableTasks(tasks, fileName);
      }
    } else {
      availableTasks(tasks, fileName);
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
