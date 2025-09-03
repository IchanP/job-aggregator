import { ExecuteSql } from "@/sql";
import sqlite3 from "sqlite3";

let db: sqlite3.Database;

export async function SetupDb(): Promise<sqlite3.Database> {
  try {
    db = new sqlite3.Database("jobs.db");
    await SetupLinkedinTable(db);
    return db;
  } catch (e) {
    console.error(`Failed to setup SQLite database: ${e}`);
    process.exit(1);
  }
}

async function SetupLinkedinTable(database: sqlite3.Database) {
  try {
    const linkedSql = `CREATE TABLE IF NOT EXISTS linkedin (
    id INTEGER PRIMARY KEY,
    exactDate DATE NOT NULL
    )`;

    await ExecuteSql(database, linkedSql);
    console.log("Linkedin table successfully created.");
  } catch (e) {
    console.error(`Failed to create Linkedin SQLite table: ${e}`);
    process.exit(1);
  }
}
