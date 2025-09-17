import { Database } from "sqlite3";
import { JobFilterer } from "./JobFilterer";

export class LinkedinFilterer extends JobFilterer {
  #db: Database;

  constructor(db: Database) {
    super();
    this.#db = db;
  }

  async filterById(): Promise<Array<LinkedinJob>> {
    const ids = this.jobs.map((item) => item.jobId);
    const placeholder = this.jobs.map(() => "?").join(", ");
    const filterSql = `SELECT * FROM linkedin WHERE id IN (${placeholder})`;

    // TODO... comes from sql module
    const knownJobs: Array<LinkedinSQLRow> = await FetchAll(
      this.#db,
      filterSql,
      ids
    );
    const knownIds = new Set(knownJobs.map((row) => row.id));
    console.log(`Found a total of ${knownIds.size} jobs with known IDs.\n`);

    return this.jobs.filter((job) => !knownIds.has(Number(job.jobId)));
  }
  catch(e: unknown) {
    console.error(`ERROR: Failed to filter seen jobs... ${e}`);
    return [];
  }
}
