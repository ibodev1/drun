import { exists, getFileContent } from "./file.ts";
import { errorMessage } from "./logs.ts";

// exists config file name
const getExistsConfigFileName = async () => {
  const denoFileExists = await exists("deno.json");
  const denoCFileExists = await exists("deno.jsonc");
  const packageFileExists = await exists("package.json");
  const configFileName = denoFileExists ? "deno.json" : denoCFileExists ? "deno.jsonc" : packageFileExists ? "package.json" : null;
  return configFileName;
}

interface ReturnValue {
  tasks: { [key: string]: string } | null;
  fileName: string | null;
}

// tasks
const getTasks = async (configFile: string | null): Promise<ReturnValue> => {
  try {
    let tasks = null;
    let fileName = null;
    if (configFile) {
      const fileExists = await exists(configFile);
      if (fileExists) {
        const filePath = await Deno.realPath(configFile);
        const fileContent = await getFileContent(filePath);
        fileName = configFile;
        tasks = fileContent?.tasks ?? fileContent?.scripts ?? null;
      } else {
        console.error(
          errorMessage(
            `${configFile ?? "deno.json"} does not exist in root directory.`,
          ),
        );
      }
    } else {
      const configFileName = await getExistsConfigFileName();
      if (configFileName) {
        const filePath = await Deno.realPath(configFileName);
        const fileContent = await getFileContent(filePath);
        fileName = configFileName;
        tasks = fileContent?.tasks ?? fileContent?.scripts ?? null;
      } else {
        console.error(errorMessage(`deno.json does not exist in root directory.`));
      }
    }
    return { tasks, fileName };
  } catch (error) {
    if (error instanceof Deno.errors.PermissionDenied) {
      console.error(
        errorMessage("Need `--allow-read` and `--allow-run` permissions."),
      );
    } else {
      throw console.error(errorMessage(new Error(error).message));
    }
    return { tasks: null, fileName: null };
  }
};

export { getTasks };
