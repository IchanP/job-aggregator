import {
  LinkedinBulk,
  LinkedinDescription,
  LinkedinJob,
} from "./boards/linkedin.js";
import "./cfg/sqlite.js";
import { SetupDb } from "./cfg/sqlite.js";
import { InsertRows } from "./sql/load.js";
import { FilterById, FilterJobs } from "./filters";
import { FilterOnKeyPhrases } from "./filters/data.js";
import { ReadJsonFile } from "./cfg/getCfg.js";

try {
  const config = await ReadJsonFile<Config>("../config.json");
  const db = await SetupDb();
  const linkedinJobs = await ReadJsonFile<LinkedinJob[]>(
    "../../dummydata/jobs.json"
  );

  /*   const linekdInJobs = await LinkedinBulk(config.linkedInParams);
   */

  // TODO - combine this into one function
  const newJobs = await FilterById(db, linkedinJobs);
  // Insert immediately after filtering by ID so no unnecessary scraping happens
  await InsertRows(db, newJobs);

  const scrapableJobs = FilterJobs(linkedinJobs);

  // Bulk scrape... a bit bad practice since we're directly modifying the job object but it's the cleanest way
  const promises = scrapableJobs.map((job) => LinkedinDescription(job));
  await Promise.allSettled(promises);

  const matchingJobs = FilterOnKeyPhrases(scrapableJobs, config.blacklist);

  // TODO - close DB when the script goes into idle mode...
} catch (e) {
  console.error(`An unexpected error happened, the program will exit: ${e}`);
}
