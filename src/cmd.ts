import os from "dos";
import { errorMessage, logger } from "./utils/logs.ts";
import { getTaskName } from "./utils/cli.ts";
import { mergeReadableStreams } from "std/streams/merge_readable_streams.ts";

const streamPipeThrough = (stream: ReadableStream<Uint8Array>) => {
  return stream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk);
        },
      }),
    )
    .pipeThrough(new TextEncoderStream());
};

const pipeThrough = (process: Deno.ChildProcess) => {
  return mergeReadableStreams(
    streamPipeThrough(process.stdout),
    streamPipeThrough(process.stderr),
  ).pipeTo(Deno.stdout.writable);
};

// run rask func
export const runCmd = async (cmd: string[]): Promise<void> => {
  try {
    if (Array.isArray(cmd) && cmd.length > 0) {
      const taskName = getTaskName();
      const isWindows = os.platform() == "windows";
      const abortController = new AbortController();

      // Add 'cmd /c' for windows
      if (isWindows) {
        const windowsProps = ["/c", "cmd"];
        for (let i = 0; i < 2; i++) {
          cmd.unshift(windowsProps[i]);
        }
      }

      const command = cmd[0];
      const args = cmd.slice(1, cmd.length);

      const runCmd: Deno.Command = new Deno.Command(command, {
        args,
        signal: abortController.signal,
        cwd: Deno.cwd(),
        stdout: "piped",
        stderr: "piped",
        windowsRawArguments: isWindows,
      });

      const realCommand = isWindows
        ? cmd.splice(2, cmd.length - 2).join(" ")
        : cmd.join(" ");

      console.log(logger(realCommand, taskName));

      const process = runCmd.spawn();

      await pipeThrough(process);

      const { success, code } = await process.status;

      if (!success) {
        abortController.abort();
        console.error(
          errorMessage(realCommand, taskName),
        );
        Deno.exit(code);
      }
    } else {
      console.error(errorMessage("Command empty!"));
    }
  } catch (error) {
    console.error(errorMessage(new Error(error).message));
  }
};
