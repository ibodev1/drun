import os from "https://deno.land/x/dos@v0.11.0/mod.ts";
import { errorMessage, logger } from "./logs.ts";

export const getTaskName = (): string => {
  return Deno.args[0] ?? "dev";
};

export const permissionCheck = async () => {
  const read = await Deno.permissions.request({ name: "read" });
  const run = await Deno.permissions.request({ name: "run" });
  return read.state === "granted" && run.state === "granted";
};

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

export const runCmd = async (cmd: string[], cwd: string): Promise<void> => {
  try {
    const taskName = getTaskName();
    const isWindows = os.platform() === "windows";
    if (isWindows) {
      const windowsProps = ["/c", "cmd"];
      for (let i = 0; i < 2; i++) {
        cmd.unshift(windowsProps[i]);
      }
    }

    const runCmd = Deno.run({
      cmd,
      cwd,
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
    });

    const realCommand = isWindows
      ? cmd.splice(2, cmd.length - 2).join(" ")
      : cmd.join(" ");
    const startLog = logger(realCommand, taskName) + "\n";
    const startLogUnit8 = new TextEncoder().encode(startLog);
    await Deno.stdout.write(startLogUnit8);

    const { code } = await runCmd.status();

    if (code !== 0) {
      const errorLogUnit8 = new TextEncoder().encode(
        errorMessage(realCommand, taskName),
      );
      await Deno.stdout.write(errorLogUnit8);
    }
    
    runCmd.close();

    Deno.exit(code);
  } catch (error) {
    console.error(errorMessage(error.toString()));
  }
};
