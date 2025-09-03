import sqlite3 from "sqlite3";

export function ExecuteSql(db: sqlite3.Database, sql: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function RunSQL(
  db: sqlite3.Database,
  sql: string,
  params: Array<any> = []
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function FetchAll<T>(
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
