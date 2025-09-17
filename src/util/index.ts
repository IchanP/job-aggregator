import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function readJsonFile<T>(filePath: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const res = fs.readFileSync(path.join(__dirname, filePath), "utf-8");
  return JSON.parse(res) as T;
}
