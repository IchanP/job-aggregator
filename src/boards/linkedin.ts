import axios from "axios";
import { parse } from "node-html-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface LinkedinJob {
  jobId: string;
  title: string;
  company: {
    name: string;
    url: string;
  };
  location: string;
  postedDate: string;
  exactDate: string;
  url: string;
}

// TODO - turn into .env variables somehow

const request_url =
  "https://linkdapi-best-unofficial-linkedin-api.p.rapidapi.com/api/v1/jobs/search";

const experienceParam = "internship,entry_level";
const location = "sweden";
const keyword = "fullstack";

const params = {
  keyword: "frontend",
  location: "sweden",
  experience: "internship,entry_level",
  timePosted: "1week",
};

const headers = {
  "x-rapidapi-key": process.env.RAPID_API_KEY,
  "x-rapidapi-host": "linkdapi-best-unofficial-linkedin-api.p.rapidapi.com",
};

export async function LinkedinDummyData() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const res = fs.readFileSync(
    path.join(__dirname, "../../dummydata/jobs.json"),
    "utf-8"
  );
  return JSON.parse(res) as Array<LinkedinJob>;
}

export async function LinkedinBulk(): Promise<Array<LinkedinJob>> {
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

// TODO - maybe we can make a bulk request... use Promise API for that?
export async function LinkedinDescription(url: string) {
  const html = await axios.get(url);

  const root = parse(html.data);
  root.querySelector("div.show-more-less-html__markup")?.rawText;
}
