import { LinkedinBulk, LinkedinDummyData } from "./boards/linkedin.js";
import "./cfg/sqlite.js";
import { SetupDb } from "./cfg/sqlite.js";
import { InsertRows } from "./sql/load.js";
import { FilterById } from "./filters";

try {
  const db = await SetupDb();
  const linkedinJobs = await LinkedinDummyData();

  // TODO - combine this into one function
  const newJobs = await FilterById(db, linkedinJobs);
  // Insert immediately after filtering by ID so no unnecessary scraping happens
  await InsertRows(db, newJobs);

  // TODO - Perform webscraping of linkedin

  // TODO - close DB when the script goes into idle mode...
} catch (e) {
  console.error(`An unexpected error happened, the program will exit: ${e}`);
}
