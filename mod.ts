import os from "https://deno.land/x/dos@v0.11.0/mod.ts";
import * as path from "https://deno.land/std@0.184.0/path/mod.ts";
import * as color from "https://deno.land/std@0.184.0/fmt/colors.ts";
import { parse } from "npm:yaml@2.2.1";

export async function projectFile(projectFilePath: string) {
  try {
    const projectFile = await Deno.readTextFile(projectFilePath);
    const parsedProjectFile = parse(projectFile);
    return parsedProjectFile;
  } catch (error) {
    if (error.toString().startsWith("NotFound")) {
      throw new Error("project.yml does not exist in root directory.");
    }
    throw error;
  }
}

export async function drun(taskName: string) {
  const projectFilePath = path.join(Deno.cwd(), "./project.yml");
  const projectFileContent = await projectFile(projectFilePath);
  const tasks = projectFileContent?.tasks ?? null;
  if (!!taskName && !!tasks) {
    const taskIndex = tasks.findIndex((task: { [key: string]: string }) => {
      return !!task[taskName]
    });

    if (taskIndex >= 0) {
      const task = tasks[taskIndex][taskName];
      let cmd = [...task.split(" ")];

      if (os.platform() === "windows") {
        cmd = ["cmd", "/c", ...task.split(" ")];
      }

      const runCmd = Deno.run({ cmd });

      const { code } = await runCmd.status();

      if (code !== 0) {
        console.log(color.bgRed(color.white(" ERROR [" + code.toString() + "] ")) + color.bgYellow(color.black(" [" + taskName + "] " + task)));
      }

      Deno.exit(code);
    }
  }
}