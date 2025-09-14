import axios from "axios";
import { parse } from "node-html-parser";
import { setTimeout } from "timers/promises";

// TODO migrate from this to another scraper?
const request_url =
  "https://linkdapi-best-unofficial-linkedin-api.p.rapidapi.com/api/v1/jobs/search";

const headers = {
  "x-rapidapi-key": process.env.RAPID_API_KEY,
  "x-rapidapi-host": "linkdapi-best-unofficial-linkedin-api.p.rapidapi.com",
};

export async function LinkedinBulk(
  params: LinkedInConfig
): Promise<Array<LinkedinJob>> {
  try {
    if (!headers["x-rapidapi-key"]) throw new Error("Missing API key.");

    const res = await axios.get(request_url, {
      headers,
      params,
    });

    if (!res.data.data.jobs) {
      return [];
    }

    const jobs: Array<LinkedinJob> = res.data.data.jobs;
    return jobs;
  } catch (e) {
    console.error(`Failed to fetch Linkedin job data: ${e}`);
    return [];
  }
}

export async function ScrapeLinkedinBulk(jobs: LinkedinJob[]) {
  const batchSize = 5;
  const delay = 4000;

  for (let i = 0; i < jobs.length; i += batchSize) {
    const spliced = jobs.slice(i, i + batchSize);
    const promises = spliced.map((job) => LinkedinDescription(job));

    await Promise.allSettled(promises);
    await setTimeout(delay);
  }
}

async function LinkedinDescription(job: LinkedinJob) {
  try {
    const html = await axios.get(job.url);
    console.log(`Gathering description from ${job.url}`);
    const root = parse(html.data);
    job.description = root.querySelector(
      "div.show-more-less-html__markup"
    )?.rawText;
  } catch (err) {
    console.error(`Failed to fetch description for ${job.url}: ${err}`);
    job.description = "";
  }
}
