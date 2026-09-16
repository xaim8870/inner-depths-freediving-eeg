import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

// pnpm forwards the `--` separator literally to package scripts.
const extraArgs = process.argv.slice(2).filter((arg) => arg !== "--" && arg !== "--webpack");
const child = spawn(
  process.execPath,
  [fileURLToPath(import.meta.resolve("next/dist/bin/next")), "dev", "--webpack", ...extraArgs],
  { stdio: "inherit" },
);

child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
