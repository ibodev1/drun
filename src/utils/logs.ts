import * as color from "std/fmt/colors.ts";
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
  console.info(color.green("DRux Available tasks: ") + color.italic(color.gray(fileName ?? "")));
  if (tasks && Array.isArray(Object.entries(tasks))) {
    const entries = Object.entries(tasks) ?? [];
    for (let i = 0; i < entries.length; i++) {
      const key = entries[i][0];
      const task = entries[i][1];
      console.info("- " + color.cyan(key.toString()));
      console.log("   " + task?.toString());
    }
  } else {
    console.error(color.red("   No tasks found in configuration file"))
  }
}
