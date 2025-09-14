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

export function FilterOnKeyPhrases(
  jobs: Array<LinkedinJob>,
  filter: Array<string>
): Array<LinkedinJob> {
  const filtered: Array<LinkedinJob> = [];

  let totalFiltered = 0;

  for (const job of jobs) {
    let shouldFilter = false;

    for (const pattern of filter) {
      try {
        const regex = new RegExp(pattern, "i");
        if (job.description?.match(regex)) {
          console.log(
            `Filtering job with title: ${job.title} in location: ${job.location}`
          );
          shouldFilter = true;
          totalFiltered++;
          break;
        }
      } catch (e: unknown) {
        if (job.description?.toLowerCase().includes(pattern.toLowerCase())) {
          shouldFilter = true;
          totalFiltered++;
          break;
        }
      }
    }
    if (!shouldFilter) {
      filtered.push(job);
    }
  }

  console.log(
    `\n>>>>>>>>>> Filtered a total of: ${totalFiltered} jobs based on their description. <<<<<<<<<<\n`
  );

  return filtered;
}
