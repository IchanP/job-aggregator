import "./cfg/sqlite.js";
import { SetupDb } from "./cfg/sqlite.js";
import { ReadJsonFile } from "./util/index.js";
import { CreateEmailTransporter } from "./cfg/nodemailer.js";
import { SqlRunner } from "./sql/SqlRunner.js";
import { LinkedinFilterer } from "./filters/LinkedinFilterer.js";
import { LinkedinFetcher } from "./boards/LinkedinFetcher.js";
import { Emailer } from "./emailer/Emailer.js";

try {
  const config = await ReadJsonFile<Config>("../config.json");
  const db = await SetupDb();
  const transporter = CreateEmailTransporter(config.emailConfig);
  const emailer = new Emailer(transporter, config.emailConfig);

  // TODO make a factory call...
  const linkedFilter = new LinkedinFilterer(
    db,
    config.blacklist,
    config.keywords
  );
  const linkedFetch = new LinkedinFetcher(
    config.linkedInConfig.linkedInParams,
    linkedFilter
  );

  const linkedinJobs = await linkedFetch.fetchJobs();

  // TODO add AF call...

  // TODO this should be called with AF jobs too
  const emailText = emailer.buildEmail(linkedinJobs, config.keywords);

  console.log(`Sending a total of ${linkedinJobs.length} jobs!`);

  await emailer.sendEmail(emailText);

  // Insert the linkedin found jobs into the db
  const linkedIds = linkedFetch.getUniqueJobs();
  await SqlRunner.insertJobs(db, linkedIds, "linkedin");

  // TODO - close DB when the script goes into idle mode...
} catch (e) {
  console.error(`An unexpected error happened, the program will exit: ${e}`);
}
