import * as color from "https://deno.land/std@0.184.0/fmt/colors.ts";
export const errorMessage = (message: string, taskName?: string | null): string => {
  if (taskName) {
    return color.red("DRux error:") + " " + color.yellow(taskName) +
      " -> " + message;
  } else {
    return color.red("DRux error:") + " " + message;
  }
};

export const logger = (message: string, taskName?: string | null) => {
  if (taskName) {
    return color.green("DRux") + " " + color.cyan(taskName) + " -> " + message;
  } else {
    return color.green("DRux") + " " + message;
  }
};

export const availableTasks = (tasks: { [key: string]: string } | null, fileName: string | null) => {
  if (tasks && Array.isArray(Object.entries(tasks))) {
    console.info(color.green("DRux Available tasks: ") + color.italic(color.gray(fileName ?? "")));
    const entries = Object.entries(tasks) ?? [];
    for (let i = 0; i < entries.length; i++) {
      const key = entries[i][0];
      const task = entries[i][1];
      console.info("- " + color.cyan(key.toString()));
      console.log("   " + task?.toString());
    }
  }
}
