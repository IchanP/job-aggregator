import sqlite3 from "sqlite3";
import { SqlRunner } from "./SqlRunner";

// TODO turn into what, class??

/**
 * TODO - Fix this so bulk insertion doesn't fail if ID is not unique...
 * This function should only be called after the jobs array has been filtered of IDs already existing in the database.
 */
export async function InsertJobs(
  db: sqlite3.Database,
  jobs: Array<LinkedinJob>
) {
  try {
    if (jobs.length === 0) return;

    const params = jobs.flatMap((item) => [item.jobId, item.exactDate]);

    const placeholder = jobs.map(() => "(?, ?)").join(", ");
    const sql = `INSERT INTO linkedin(id, exactDate) VALUES ${placeholder}`;

    await SqlRunner.runSQL(db, sql, params);
  } catch (e) {
    console.error(`Failed to load jobs into Linkedin table: ${e}`);
  }
}
