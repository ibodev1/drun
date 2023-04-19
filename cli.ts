import { drun } from './mod.ts';
import { permissionCheck } from './src/utils.ts';

const permissions = await permissionCheck();

if (import.meta.main && permissions) {
  const taskName = Deno.args[0];
  drun(taskName);
}
