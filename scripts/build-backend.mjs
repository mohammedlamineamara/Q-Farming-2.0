import * as esbuild from "esbuild";

try {
  await esbuild.build({
    entryPoints: ["api/boot.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    outdir: "dist",
    banner: {
      js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
    },
  });

  console.log("Backend build completed successfully.");
} catch (error) {
  console.error("Backend build failed.");
  console.error(error);
  process.exit(1);
}
