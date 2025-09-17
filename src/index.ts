import { LinkedinBulk, ScrapeLinkedinBulk } from "./boards/linkedin.js";
import "./cfg/sqlite.js";
import { SetupDb } from "./cfg/sqlite.js";
import { InsertJobs } from "./sql/load.js";
import { FilterLinkedinById, FilterJobs } from "./filters";
import { FilterOnKeyPhrases } from "./filters/data.js";
import { FilterUniqueJobs, ReadJsonFile } from "./util/index.js";
import { BuildEmail } from "./emailer/builder.js";
import { CreateEmailTransporter } from "./cfg/nodemailer.js";
import { SendEmail } from "./emailer/sender.js";
import { Database } from "sqlite3";
import { LinkedinFetcher } from "./boards/LinkedinFetcher.js";
import { LinkedinFilterer } from "./filters/LinkedinFilterer.js";

try {
  const config = await ReadJsonFile<Config>("../config.json");
  const db = await SetupDb();
  const transporter = CreateEmailTransporter(config.emailConfig);

  const idFilteretedJobs: LinkedinJob[] = [];
  const matchingJobs: LinkedinJob[] = [];

  if (config.linkedInConfig.call) {
    const foundLinkedinJobs = await LinkedinFetch(
      config.linkedInConfig,
      db,
      idFilteretedJobs
    );
    matchingJobs.push(
      ...FilterOnKeyPhrases(foundLinkedinJobs, config.blacklist)
    );
  }

  // TODO add AF call...

  // TODO this should be called with AF jobs too
  const emailText = BuildEmail(matchingJobs, config.keywords);

  console.log(`Sending a total of ${matchingJobs.length} jobs!`);

  await SendEmail(transporter, emailText, config.emailConfig);

  // Insert the found jobs into the db
  await InsertJobs(db, idFilteretedJobs);

  // TODO - close DB when the script goes into idle mode...
} catch (e) {
  console.error(`An unexpected error happened, the program will exit: ${e}`);
}
