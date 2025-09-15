import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function ReadJsonFile<T>(filePath: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const res = fs.readFileSync(path.join(__dirname, filePath), "utf-8");
  return JSON.parse(res) as T;
}

export function FilterUniqueJobs(jobs: LinkedinJob[]): LinkedinJob[] {
  return jobs.filter(
    (value, index, self) =>
      self.findIndex((v) => v.jobId === value.jobId) === index
  );
}
