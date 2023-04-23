import { errorMessage } from './logs.ts';

async function denoFile(denoFilePath: string) {
  try {
    const fileExists = await exists(denoFilePath);
    if (fileExists) {
      const denoFile = await Deno.readTextFile(denoFilePath);
      return JSON.parse(denoFile);
    } else {
      return null;
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

// Exists file
// Github : https://github.com/BentoumiTech/denox/blob/bc6cfdfb30fa2d130c5d1963350420229c47e912/src/utils/file.ts#L29
async function exists(filename: string | null = "deno.json"): Promise<boolean> {
  try {
    const fileInfo = await Deno.stat(filename ?? "deno.json");
    return fileInfo?.isFile ?? true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(
        errorMessage(`${filename ?? "deno.json"} does not exist in root directory.`),
      );
      return false;
    }
    throw error;
  }
}

export { denoFile, exists }