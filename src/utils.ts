import os from "https://deno.land/x/dos@v0.11.0/mod.ts";
import * as color from "https://deno.land/std@0.184.0/fmt/colors.ts";
import { parse } from "https://esm.sh/yaml@2.2.1";

export const getTaskName = (): string => {
  return Deno.args[0] ?? "dev";
};

export const permissionCheck = async () => {
  const read = await Deno.permissions.request({ name: "read" });
  const run = await Deno.permissions.request({ name: "run" });
  return read.state === "granted" && run.state === "granted";
};

export async function projectFile(projectFilePath: string) {
  try {
    const fileInfo = await Deno.stat(projectFilePath);
    if (fileInfo.isFile) {
      const projectFile = await Deno.readTextFile(projectFilePath);
      const parsedProjectFile = parse(projectFile);
      return parsedProjectFile;
    } else {
      return null;
    }
  } catch (error) {
    if (error.toString().startsWith("NotFound")) {
      throw new Error("project.yml does not exist in root directory.");
    }
    throw error;
  }
}

export const runCmd = async (cmd: string[], cwd: string): Promise<number> => {
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
  const startLog = color.green("DRux") + " " + color.cyan(taskName) + " " +
    realCommand + "\n";
  const startLogUnit8 = new TextEncoder().encode(startLog);
  await Deno.stdout.write(startLogUnit8);

  const { code } = await runCmd.status();

  if (code !== 0) {
    const errorLog = color.red("DRux ERROR") + " " + color.yellow(taskName) +
      " " +
      realCommand;
    const errorLogUnit8 = new TextEncoder().encode(errorLog);
    await Deno.stdout.write(errorLogUnit8);
  }

  runCmd.close();

  Deno.exit(code);
};
