import "./cfg/sqlite.js";
import { setupDb } from "./cfg/sqlite.js";
import { readJsonFile } from "./util/index.js";
import { createEmailTransporter } from "./cfg/nodemailer.js";
import { SqlRunner } from "./sql/SqlRunner.js";
import { Emailer } from "./emailer/Emailer.js";
import { JobFetcherFactory } from "./boards/JobFetcherFactory.js";

try {
  const config = await readJsonFile<Config>("../config.json");
  const db = await setupDb();
  const transporter = createEmailTransporter(config.emailConfig);
  const emailer = new Emailer(transporter, config.emailConfig);
  const fetcherFactory = new JobFetcherFactory(config, db);

  const enabledSoruces: JobBoards[] = [];
  if (config.linkedInConfig.call) {
    enabledSoruces.push("linkedin");
  }
  if (config.afConfig.call) {
    enabledSoruces.push("af");
  }

  const fetchers: JobFetcher[] = [];

  for (const source of enabledSoruces) {
    const fetcher = fetcherFactory.createFetcher(source);
    fetchers.push(fetcher);
  }

  const jobs: LinkedinJob[] = [];

  for (const fetcher of fetchers) {
    jobs.push(...(await fetcher.fetchJobs()));
  }

  const emailText = emailer.buildEmail(jobs, config.keywords);
  console.log(`Sending a total of ${jobs.length} jobs!`);
  await emailer.sendEmail(emailText);

  // Insert the linkedin found jobs into the db
  for (const fetcher of fetchers) {
    const uniqueIds = fetcher.getUniqueJobs();
    await SqlRunner.insertJobs(db, uniqueIds, fetcher.board);
  }

  // TODO - close DB when the script goes into idle mode...
} catch (e) {
  console.error(`An unexpected error happened, the program will exit: ${e}`);
}
