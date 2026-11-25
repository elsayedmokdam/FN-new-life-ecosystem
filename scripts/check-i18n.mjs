// Fails when a t("key") used in the code is missing from a dictionary (or the dictionaries differ).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (d) =>
  readdirSync(d).flatMap((f) =>
    statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)],
  );
const dict = readFileSync("src/i18n/dictionaries.ts", "utf8");
const [arPart, enPart] = dict.split("export const en");
const keysOf = (s) =>
  new Set([...s.matchAll(/^\s*"?([\w.]+)"?:\s*"/gm)].map((m) => m[1]));
const ar = keysOf(arPart);
const en = keysOf(enPart);

let bad = 0;
for (const k of ar) if (!en.has(k)) (console.error("missing in EN:", k), bad++);
for (const k of en) if (!ar.has(k)) (console.error("missing in AR:", k), bad++);
for (const f of walk("src").filter(
  (f) => /\.tsx?$/.test(f) && !f.includes("dictionaries"),
)) {
  for (const m of readFileSync(f, "utf8").matchAll(/\bt\(\s*"([^"]+)"/g))
    if (!ar.has(m[1])) (console.error(`unknown key "${m[1]}" in ${f}`), bad++);
}
console.log(bad ? `${bad} problem(s)` : `i18n OK (${ar.size} keys)`);
process.exit(bad ? 1 : 0);
