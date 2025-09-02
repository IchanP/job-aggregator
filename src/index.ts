import { LinkedinBulk, LinkedinDummyData } from "./boards/linkedin.js";

try {
  const linkedinJobs = await LinkedinDummyData();

  console.log(linkedinJobs[0].jobId);
} catch (e) {
  console.error(`An unexpected error happened, the program will exit: ${e}`);
}
