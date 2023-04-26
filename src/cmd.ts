import os from "https://deno.land/x/dos@v0.11.0/mod.ts";
import { errorMessage, logger } from "./utils/logs.ts";
import { getTaskName } from './utils/cli.ts';

// run rask func
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
