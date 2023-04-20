import { assert } from "https://deno.land/std@0.184.0/testing/asserts.ts";

Deno.test("drux is file", async (): Promise<void> => {
  const projectFilePath = await Deno.realPath("project.yml");
  const fileInfo = await Deno.stat(projectFilePath);
   assert(fileInfo.isFile);
});
