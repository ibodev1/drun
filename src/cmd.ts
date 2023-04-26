import os from "https://deno.land/x/dos@v0.11.0/mod.ts";
import { errorMessage, logger } from "./utils/logs.ts";
import { getTaskName } from './utils/cli.ts';
import { readLines } from "https://deno.land/std@0.184.0/io/mod.ts";
import { writeAll } from "https://deno.land/std@0.184.0/streams/write_all.ts";

async function pipeThrough(
  reader: Deno.Reader | null,
  writer: Deno.Writer | null
) {
  const encoder = new TextEncoder();
  if (writer && reader) {
    for await (const line of readLines(reader)) {
      await writeAll(writer, encoder.encode(`${line}\n`));
    }
  }
}

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

    const runCmd: Deno.Process = Deno.run({
      cmd,
      cwd,
      stdout: "piped",
      stderr: "piped"
    });

    const realCommand = isWindows
      ? cmd.splice(2, cmd.length - 2).join(" ")
      : cmd.join(" ");

    console.log(logger(realCommand, taskName));

    pipeThrough(runCmd.stdout, Deno.stdout);
    pipeThrough(runCmd.stderr, Deno.stderr);

    const { code, success } = await runCmd.status();

    if (!success) {
      runCmd.close();
      Deno.close(runCmd.rid);
      Deno.exit(code)
    }

    runCmd.close();
    Deno.close(runCmd.rid);
  } catch (error) {
    if(error instanceof Deno.errors.BrokenPipe){
      console.log(errorMessage("DRux Error!"));
    }
  }
};
