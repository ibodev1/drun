import { errorMessage } from './logs.ts';

export async function denoFile(denoFilePath: string) {
  try {
    const fileInfo = await Deno.stat(denoFilePath);
    if (fileInfo.isFile) {
      const denoFile = await Deno.readTextFile(denoFilePath);
      return JSON.parse(denoFile);
    } else {
      return null;
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(
        errorMessage("deno.json does not exist in root directory."),
      );
    } else if (error instanceof Deno.errors.PermissionDenied) {
      console.error(
        errorMessage("Need `--allow-read` and `--allow-run` permissions."),
      );
    } else {
      throw error;
    }
  }
}
