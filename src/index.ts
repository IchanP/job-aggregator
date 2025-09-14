import { LinkedinBulk, ScrapeLinkedinBulk } from "./boards/linkedin.js";
import "./cfg/sqlite.js";
import { SetupDb } from "./cfg/sqlite.js";
import { InsertJobs } from "./sql/load.js";
import { FilterById, FilterJobs } from "./filters";
import { FilterOnKeyPhrases } from "./filters/data.js";
import { ReadJsonFile } from "./util/index.js";
import { BuildEmail } from "./emailer/builder.js";
import { CreateEmailTransporter } from "./cfg/nodemailer.js";
import { SendEmail } from "./emailer/sender.js";
import { setTimeout } from "timers/promises";

try {
  const config = await ReadJsonFile<Config>("../config.json");
  const db = await SetupDb();
  const transporter = CreateEmailTransporter(config.emailConfig);

  const linekdInJobs = await LinkedinBulk(config.linkedInParams);
  console.log(`Fetched a total of ${linekdInJobs.length} from the API! \n`);

  // TODO - combine this into one function
  const idFilteretedJobs = await FilterById(db, linekdInJobs);

  const scrapableJobs = FilterJobs(linekdInJobs);

  // Bulk scrape... a bit bad practice since we're directly modifying the job object but it's the cleanest way
  await ScrapeLinkedinBulk(scrapableJobs);

  const matchingJobs = FilterOnKeyPhrases(scrapableJobs, config.blacklist);

  const emailText = BuildEmail(matchingJobs, config.keywords);
  await SendEmail(transporter, emailText, config.emailConfig);

  // Insert the found jobs into the db
  await InsertJobs(db, idFilteretedJobs);

  // TODO - close DB when the script goes into idle mode...
} catch (e) {
  console.error(`An unexpected error happened, the program will exit: ${e}`);
}
