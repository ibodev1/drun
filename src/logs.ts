import * as color from "https://deno.land/std@0.184.0/fmt/colors.ts";
export const errorMessage = (message: string, taskName?: string): string => {
  if (taskName) {
    return color.red("DRux error:") + " " + color.yellow(taskName) +
      " " + message;
  } else {
    return color.red("DRux error:") + " " + message;
  }
};

export const logger = (message: string, taskName?: string) => {
  if (taskName) {
    return color.green("DRux") + " " + color.cyan(taskName) + " " + message;
  } else {
    return color.green("DRux") + " " + message;
  }
};
