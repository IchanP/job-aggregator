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

async function LinkedinFetch(
  config: LinekdInConfig,
  db: Database,
  idFilter: LinkedinJob[]
) {
  const linekdInJobs = [];

  for (let i = 0; i < config.linkedInParams.length; i++) {
    linekdInJobs.push(...(await LinkedinBulk(config.linkedInParams[i])));
  }

  console.log(`Fetched a total of ${linekdInJobs.length} from the API! \n`);

  const uniqueJobs = FilterUniqueJobs(linekdInJobs);

  console.log(
    `Filtered duplicate jobs. A total of ${uniqueJobs.length} jobs remain.`
  );

  const idFilteretedJobs = await FilterLinkedinById(db, uniqueJobs);

  idFilter.push(...idFilteretedJobs);

  console.log(
    `Filtered jobs by ID. A total of ${idFilteretedJobs.length} jobs remain.`
  );

  const scrapableJobs = FilterJobs(uniqueJobs);

  // Bulk scrape... a bit bad practice since we're directly modifying the job object but it's the cleanest way
  return await ScrapeLinkedinBulk(scrapableJobs);
}
