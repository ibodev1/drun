export const getTaskName = (): string | null => {
  return Deno.args[0] && !Deno.args[0].includes("-") ? Deno.args[0] : null;
};

export const getConfigFile = (): string | null => {
  const configIndex = Deno.args.findIndex((arg) => arg === "--config" || arg === "-c");
  const configFileName = Deno.args[configIndex + 1] ?? null;
  return configIndex >= 1 && configFileName && (configFileName.endsWith(".json") || configFileName.endsWith(".jsonc")) ? configFileName : null;
};
