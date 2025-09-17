export abstract class JobFilterer implements Filterer {
  protected jobs: LinkedinJob[] = [];

  setJobs(jobs: LinkedinJob[]) {
    // TODO do some verification?
    this.jobs = jobs;
  }

  filterOnPhrase(phrases: Array<string>): Array<LinkedinJob> {
    const filtered: Array<LinkedinJob> = [];

    let totalFiltered = 0;

    for (const job of this.#jobs) {
      let shouldFilter = false;

      for (const pattern of phrases) {
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

  filterOnTitle(): Array<LinkedinJob> {
    const filtered: LinkedinJob[] = [];

    for (const job of this.#jobs) {
      if (this.#checkLatinCharacterCount(job.title)) {
        filtered.push(job);
      }
    }

    return filtered;
  }

  #checkLatinCharacterCount(str: string) {
    let nonLatin = 0;
    for (const letter of str) {
      if (letter.match(/[^\p{Script=Latin}\s\d]/u)) {
        nonLatin++;
      }
    }

    return nonLatin / str.length < 0.5;
  }

  abstract filterById(jobs: LinkedinJob[]): Promise<Array<LinkedinJob>>;
}
