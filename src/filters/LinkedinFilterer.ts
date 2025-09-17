import { Database } from "sqlite3";
import { JobFilterer } from "./JobFilterer";
import { SqlRunner } from "@/sql/SqlRunner";

export class LinkedinFilterer extends JobFilterer {
  #db: Database;

  constructor(db: Database, blacklist: string[]) {
    super(blacklist);
    this.#db = db;
  }

  async filterById(): Promise<void> {
    const ids = this.jobs.map((item) => item.jobId);
    const placeholder = this.jobs.map(() => "?").join(", ");
    const filterSql = `SELECT * FROM linkedin WHERE id IN (${placeholder})`;

    const knownJobs: Array<LinkedinSQLRow> = await SqlRunner.fetchAll(
      this.#db,
      filterSql,
      ids
    );
    const knownIds = new Set(knownJobs.map((row) => row.id));
    console.log(`Found a total of ${knownIds.size} jobs with known IDs.\n`);

    const filtered = this.jobs.filter(
      (job) => !knownIds.has(Number(job.jobId))
    );

    this.setJobs(filtered);
  }
  catch(e: unknown) {
    console.error(`ERROR: Failed to filter seen jobs... ${e}`);
    // TODO maybe just exit completely?
  }
}
