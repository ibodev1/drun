export async function permissionCheck() {
    const read = await Deno.permissions.request({ name: "read" });
    const run = await Deno.permissions.request({ name: "run" });
    return read.state === "granted" && run.state === "granted";
}