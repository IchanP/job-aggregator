import { LinkedinJob } from "@/boards/linkedin";

export function FilterByTitle(jobs: Array<LinkedinJob>): Array<LinkedinJob> {
  const filtered: LinkedinJob[] = [];

  for (const job of jobs) {
    if (CheckLatinCharacterCount(job.title)) {
      filtered.push(job);
    }
  }

  return filtered;
}

function CheckLatinCharacterCount(str: string) {
  let nonLatin = 0;
  for (const letter of str) {
    if (letter.match(/[^\p{Script=Latin}\s\d]/u)) {
      nonLatin++;
    }
  }

  return nonLatin / str.length < 0.5;
}
