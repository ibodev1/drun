import { exists, getFileContent } from "./file.ts";
import { errorMessage } from "./logs.ts";

const getTasks = async (configFile: string | null) => {
  try {
    const fileExists = await exists(configFile);
    const denoFileExists = await exists("deno.json");
    const packageFileExists = await exists("package.json");
    let tasks = null;
    if (fileExists || denoFileExists) {
      const filePath = await Deno.realPath(configFile ?? "deno.json");
      const fileContent = await getFileContent(filePath);
      const contentTasks = fileContent?.tasks
        ? fileContent?.tasks
        : fileContent?.scripts;
      tasks = contentTasks ?? null;
    } else if (packageFileExists) {
      const packageFilePath = await Deno.realPath("package.json");
      const packageFileContent = await getFileContent(packageFilePath);
      tasks = packageFileContent?.scripts ?? null;
    } else {
      console.error(
        errorMessage(
          `${configFile ?? "deno.json"} does not exist in root directory.`,
        ),
      );
    }
    return tasks;
  } catch (error) {
    if (error instanceof Deno.errors.PermissionDenied) {
      console.error(
        errorMessage("Need `--allow-read` and `--allow-run` permissions."),
      );
    } else {
      throw error;
    }
  }
};

export { getTasks };
