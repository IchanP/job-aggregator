import { FetchAll } from "../sql";
import { LinkedinJob } from "../boards/linkedin";
import sqlite3 from "sqlite3";

export async function FilterById(
  db: sqlite3.Database,
  jobs: Array<LinkedinJob>
): Promise<LinkedinJob[]> {
  try {
    const ids = jobs.map((item) => item.jobId);
    const placeholder = jobs.map(() => "?").join(", ");
    const filterSql = `SELECT * FROM linkedin WHERE id IN (${placeholder})`;

    const knownJobs: Array<LinkedinSQLRow> = await FetchAll(db, filterSql, ids);
    const knownIds = new Set(knownJobs.map((row) => row.id));

    return jobs.filter((job) => !knownIds.has(Number(job.jobId)));
  } catch (e) {
    console.error(`ERROR: Failed to filter seen jobs... ${e}`);
    return [];
  }
}

//  TODO - Filter jobs with non-latin titles?
