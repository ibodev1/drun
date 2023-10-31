import { assert } from "std/assert/mod.ts";

Deno.test("drux is file", async (): Promise<void> => {
  const denoFilePath = await Deno.realPath("deno.json");
  const fileInfo = await Deno.stat(denoFilePath);
   assert(fileInfo.isFile);
});
