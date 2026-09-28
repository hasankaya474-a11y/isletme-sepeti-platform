import { readFileSync, existsSync } from "node:fs";

const required = [
  "docs/ARCHITECTURE_LOCK.md",
  "docs/WORK_PLAN.md",
  "docs/adr/0001-independent-platform.md",
  "docs/adr/0002-modular-monolith.md",
  "docs/adr/0003-codeless-operations.md"
];

const missing = required.filter((p) => !existsSync(p));
if (missing.length) {
  console.error("Architecture gate FAIL. Missing:", missing.join(", "));
  process.exit(1);
}

const lock = readFileSync("docs/ARCHITECTURE_LOCK.md", "utf8");
for (const rule of ["normal daily operation", "Help & Site Guide", "Production stays locked"]) {
  if (!lock.includes(rule)) {
    console.error("Architecture gate FAIL. Missing constitutional rule:", rule);
    process.exit(1);
  }
}
console.log("Architecture gate PASS");
