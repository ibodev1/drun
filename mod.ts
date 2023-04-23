import { runCmd } from "./src/cmd.ts";
import { denoFile, exists, packageFile } from "./src/utils/file.ts";
import { errorMessage } from "./src/utils/logs.ts";
import * as color from "https://deno.land/std@0.184.0/fmt/colors.ts";

export async function drux(
  taskName: string | null,
  configFile: string | null = "deno.json",
) {
  try {
    const denoFileExists = await exists(configFile ?? "deno.json");
    const packageFileExists = await exists("package.json");
    if (denoFileExists || packageFileExists) {
      let tasks = [];
      if (denoFileExists) {
        const denoFilePath = await Deno.realPath(configFile ?? "deno.json");
        const denoFileContent = await denoFile(denoFilePath);
        tasks = denoFileContent ?? null;
      } else if (packageFileExists) {
        const packageFilePath = await Deno.realPath("package.json");
        const packageFileContent = await packageFile(packageFilePath);
        tasks = packageFileContent ?? null;
      }
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
    } else {
      console.error(
        errorMessage(
          `${configFile ?? "deno.json"} does not exist in root directory.`,
        ),
      );
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
