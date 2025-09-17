import sqlite3 from "sqlite3";
// Option 2: Return custom result object
interface SqlResult {
  changes: number;
  lastInsertRowId?: number;
}
export class SqlRunner {
  static executeSql(db: sqlite3.Database, sql: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  static runSQL(
    db: sqlite3.Database,
    sql: string,
    params: Array<any> = []
  ): Promise<SqlResult> {
    return new Promise<SqlResult>((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else
          resolve({
            changes: this.changes,
            lastInsertRowId: this.lastID,
          });
      });
    });
  }

  static fetchAll<T>(
    db: sqlite3.Database,
    sql: string,
    params: Array<any> = []
  ): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      db.all(sql, params, (err, rows: T[]) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static async insertJobs(
    db: sqlite3.Database,
    jobs: Array<LinkedinJob>,
    table: "linkedin"
  ) {
    try {
      if (jobs.length === 0) return;

      const params = jobs.flatMap((item) => [item.jobId, item.exactDate]);

      const placeholder = jobs.map(() => "(?, ?)").join(", ");
      const sql = `INSERT OR IGNORE INTO ${table}(id, exactDate) VALUES ${placeholder}`;

      const result = await SqlRunner.runSQL(db, sql, params);
      const skipped = jobs.length - result.changes;
      console.log(
        `\n >>>>> Successfully inserted ${result.changes} rows. Skipped a total of ${skipped} rows.... <<<<\n`
      );
    } catch (e) {
      console.error(`Failed to load jobs into Linkedin table: ${e}`);
    }
  }
}
