import axios from "axios";

export class LinkedinFetcher implements JobFetcher {
  #filter: Filterer;
  #params: LinkedinApiParams[] = [];

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

  async fetchJobs(): Promise<Array<LinkedinJob>> {
    let ids = [];
    for (let i = 0; i < this.#params.length; i++) {
      ids = await this.#fetchIds(this.#params[i]);
    }
    // TODO add filters...
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
}
