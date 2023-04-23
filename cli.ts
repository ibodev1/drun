import { drux } from "./mod.ts";
import { permissionCheck } from "./src/utils/permission.ts";
import { getConfigFile, getTaskName } from "./src/utils/cli.ts";

const permissions = await permissionCheck();

if (import.meta.main && permissions) {
  const taskName = getTaskName();
  const configFile = getConfigFile();
  drux(taskName, configFile);
}
