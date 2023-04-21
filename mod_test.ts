import { assert } from "https://deno.land/std@0.184.0/testing/asserts.ts";

Deno.test("drux is file", async (): Promise<void> => {
  const denoFilePath = await Deno.realPath("deno.json");
  const fileInfo = await Deno.stat(denoFilePath);
   assert(fileInfo.isFile);
});
