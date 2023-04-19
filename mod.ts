import os from "dos";
import * as path from "path";
import * as color from "fmt/colors.ts";
import { parse } from "yaml";

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

export async function drux(taskName: string) {
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