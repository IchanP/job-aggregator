import { SqlRunner } from "@/sql/SqlRunner";
import sqlite3 from "sqlite3";

// TODO set up AF table...

export async function setupDb(): Promise<sqlite3.Database> {
  try {
    const db = new sqlite3.Database("jobs.db");
    await setupLinkedinTable(db);
    return db;
  } catch (e) {
    console.error(`Failed to setup SQLite database: ${e}`);
    process.exit(1);
  }
}

async function setupLinkedinTable(database: sqlite3.Database) {
  try {
    const linkedSql = `CREATE TABLE IF NOT EXISTS linkedin (
    id INTEGER PRIMARY KEY,
    exactDate DATE NOT NULL
    )`;

    await SqlRunner.executeSql(database, linkedSql);
    console.log("Linkedin table successfully created.");
  } catch (e) {
    console.error(`Failed to create Linkedin SQLite table: ${e}`);
    process.exit(1);
  }
}
