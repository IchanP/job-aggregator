import { LinkedinBulk, ScrapeLinkedinBulk } from "./boards/linkedin.js";
import "./cfg/sqlite.js";
import { SetupDb } from "./cfg/sqlite.js";
import { InsertJobs } from "./sql/load.js";
import { FilterById, FilterJobs } from "./filters";
import { FilterOnKeyPhrases } from "./filters/data.js";
import { FilterUniqueJobs, ReadJsonFile } from "./util/index.js";
import { BuildEmail } from "./emailer/builder.js";
import { CreateEmailTransporter } from "./cfg/nodemailer.js";
import { SendEmail } from "./emailer/sender.js";

try {
  const config = await ReadJsonFile<Config>("../config.json");
  const db = await SetupDb();
  const transporter = CreateEmailTransporter(config.emailConfig);

  const linekdInJobs = [];

  for (let i = 0; i < config.linkedInParams.length; i++) {
    linekdInJobs.push(...(await LinkedinBulk(config.linkedInParams[i])));
  }

  console.log(`Fetched a total of ${linekdInJobs.length} from the API! \n`);

  const uniqueJobs = FilterUniqueJobs(linekdInJobs);

  console.log(
    `Filtered duplicate jobs. A total of ${uniqueJobs.length} jobs remain.`
  );

  const idFilteretedJobs = await FilterById(db, uniqueJobs);

  console.log(
    `Filtered jobs by ID. A total of ${idFilteretedJobs.length} jobs remain.`
  );

  const scrapableJobs = FilterJobs(uniqueJobs);

  // Bulk scrape... a bit bad practice since we're directly modifying the job object but it's the cleanest way
  await ScrapeLinkedinBulk(scrapableJobs);

  const matchingJobs = FilterOnKeyPhrases(scrapableJobs, config.blacklist);

  const emailText = BuildEmail(matchingJobs, config.keywords);

  console.log(`Sending a total of ${matchingJobs.length} jobs!`);

  await SendEmail(transporter, emailText, config.emailConfig);

  // Insert the found jobs into the db
  await InsertJobs(db, idFilteretedJobs);

  // TODO - close DB when the script goes into idle mode...
} catch (e) {
  console.error(`An unexpected error happened, the program will exit: ${e}`);
}
