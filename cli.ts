import { drux } from "./mod.ts";
import { permissionCheck } from "./src/utils.ts";
import { getTaskName, getConfigFile } from "./src/utils_cli.ts";

const permissions = await permissionCheck();

if (import.meta.main && permissions) {
  const taskName = getTaskName();
  const configFile = getConfigFile();
  drux(taskName, configFile);
}
