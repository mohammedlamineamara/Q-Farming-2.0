import { runRepair } from "./index-repair-runner";

async function main() {
  console.log("=== Q-FARMING PRODUCTION INDEX REPAIR RUNNER ===");
  console.log("Mode: DRY-RUN (Default)");
  console.log("Executing strict read-only audit against database...");

  try {
    const result = await runRepair({ execute: false });
    console.log("\n" + JSON.stringify(result.summary, null, 2));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Runner failed:", message.replace(/:[^@]+@/, ":***@"));
    process.exit(1);
  }
}

main();
