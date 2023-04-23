export const permissionCheck = async () => {
  const read = await Deno.permissions.request({ name: "read" });
  const run = await Deno.permissions.request({ name: "run" });
  return read.state === "granted" && run.state === "granted";
};
