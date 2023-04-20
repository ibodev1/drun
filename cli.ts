import { drux } from "./mod.ts";
import { getTaskName, permissionCheck } from "./src/utils.ts";

const permissions = await permissionCheck();

if (import.meta.main && permissions) {
  const taskName = getTaskName();
  drux(taskName);
}
