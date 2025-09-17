import { FilterUniqueJobs } from "@/util";
import axios from "axios";
import { setTimeout } from "timers/promises";
import { parse } from "node-html-parser";
import { Filterer } from "@/filters/JobFilterer";

export class LinkedinFetcher implements JobFetcher {
  #filter: Filterer;
  #params: LinkedinApiParams[] = [];
  #uniqueJobs: LinkedinJob[] = [];

  #request_url =
    "https://linkdapi-best-unofficial-linkedin-api.p.rapidapi.com/api/v1/jobs/search";

  // TODO make host an env variable?
  #headers = {
    "x-rapidapi-key": process.env.RAPID_API_KEY,
    "x-rapidapi-host": "linkdapi-best-unofficial-linkedin-api.p.rapidapi.com",
  };

  constructor(params: LinkedinApiParams[], filter: Filterer) {
    this.#params = params;
    this.#filter = filter;
  }

  getUniqueJobs(): LinkedinJob[] {
    return Array.from(this.#uniqueJobs);
  }

  async fetchJobs(): Promise<Array<LinkedinJob>> {
    let ids: LinkedinJob[] = [];
    for (let i = 0; i < this.#params.length; i++) {
      ids.push(...(await this.#fetchIds(this.#params[i])));
    }

    this.#filter.setJobs(ids);
    await this.#filter.filterById();
    this.#uniqueJobs = this.#filter.getJobs();

    this.#filter.filterOnTitle();

    const describedJobs = await this.#scrapeLinkedinBulk(
      this.#filter.getJobs()
    );
    this.#filter.setJobs(describedJobs);
    this.#filter.filterOnPhrase();

    return this.#filter.getJobs();
  }

  async #fetchIds(params: LinkedinApiParams) {
    try {
      if (!this.#headers["x-rapidapi-key"]) throw new Error("Missing API key.");

      const res = await axios.get(this.#request_url, {
        headers: this.#headers,
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

  async #scrapeLinkedinBulk(jobs: LinkedinJob[]) {
    const batchSize = 5;
    const delay = 2000;
    let remainingJobs = [...jobs];
    let attempt = 0;
    const maxAttempts = 3;

    while (remainingJobs.length > 0 && attempt < maxAttempts) {
      attempt++;
      const failedJobs: LinkedinJob[] = [];

      console.log(
        `Attempt ${attempt}: Processing ${remainingJobs.length} jobs`
      );

      for (let i = 0; i < remainingJobs.length; i += batchSize) {
        const batch = remainingJobs.slice(i, i + batchSize);
        const promises = batch.map((job) =>
          this.#linkedinDescription(job, failedJobs)
        );

        await Promise.allSettled(promises);
        await setTimeout(delay * attempt); // Increase delay with each attempt
      }

      remainingJobs = failedJobs;

      if (remainingJobs.length > 0) {
        console.log(
          `${remainingJobs.length} jobs failed, attempt ${attempt}/${maxAttempts}`
        );
      }
    }

    if (remainingJobs.length > 0) {
      console.warn(
        `${remainingJobs.length} jobs permanently failed after ${maxAttempts} attempts`
      );
    }

    // TODO put this in a base class?
    return FilterUniqueJobs(jobs);
  }

  async #linkedinDescription(job: LinkedinJob, failedJobs: LinkedinJob[]) {
    try {
      const html = await axios.get(job.url);
      console.log(`✓ Gathered description from ${job.url}`);
      const root = parse(html.data);
      job.description = root.querySelector(
        "div.show-more-less-html__markup"
      )?.rawText;
    } catch (err: any) {
      console.error(
        `✗ Failed to fetch description for ${job.url}: ${err.message}`
      );

      // Only retry on rate limiting errors
      if (err.response?.status === 429) {
        failedJobs.push(job);
      }
    }
  }
}
