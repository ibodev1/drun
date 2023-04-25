import { errorMessage } from "./logs.ts";

async function getFileContent(denoFilePath: string) {
  try {
    const fileExists = await exists(denoFilePath);
    if (fileExists) {
      const denoFile = await Deno.readTextFile(denoFilePath);
      if (isJSON(denoFile)){
        return JSON.parse(denoFile) ?? null;
      } else {
        console.error(errorMessage(denoFilePath + " is not a json file."));
        return null;
      }
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
async function exists(filename: string | null): Promise<boolean> {
  try {
    if (filename) {
      const fileInfo = await Deno.stat(filename);
      return fileInfo?.isFile ?? true;
    } else {
      return false;
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error;
  }
}


function isJSON(text: string | null): boolean {
  try {
    if (text) {
      JSON.parse(text);
      return true;
    } else {
      return false;
    }
  } catch (_error) {
    return false;
  }
}

export { getFileContent, exists };
