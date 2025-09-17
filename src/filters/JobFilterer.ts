export interface Filterer {
  filterOnPhrase: () => void;
  filterOnTitle: () => void;
  filterById: () => Promise<void>;
  filterUnique: (jobs: LinkedinJob[]) => LinkedinJob[];
  setJobs: (jobs: LinkedinJob[]) => void;
  getJobs(): LinkedinJob[];
}

export abstract class JobFilterer implements Filterer {
  protected jobs: LinkedinJob[] = [];
  private filteredWords: Array<string>;
  private keywords: Array<string>;

  constructor(blacklist: string[], kewyords: string[]) {
    this.filteredWords = blacklist;
    this.keywords = kewyords;
  }

  setJobs(jobs: LinkedinJob[]) {
    // TODO do some verification?
    this.jobs = jobs;
  }

  getJobs() {
    return Array.from(this.jobs); // Don't care that it's a shallow copy.
  }

  filterUnique(jobs: LinkedinJob[]): LinkedinJob[] {
    return jobs.filter(
      (value, index, self) =>
        self.findIndex((v) => v.jobId === value.jobId) === index
    );
  }

  filterOnPhrase(): void {
    const filtered: Array<LinkedinJob> = [];

    let totalFiltered = 0;

    for (const job of this.jobs) {
      let shouldFilter = false;

      // Only add jobs that don't have this phrase
      for (const pattern of this.filteredWords) {
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

      /*       // TODO - Remove this filter and keep the highlight?
      let hasKeyword = false;
      // Only add jobs that have these keywords
      for (const keyword of this.keywords) {
        if (
          (job.description &&
            job.description.toLowerCase().includes(keyword.toLowerCase())) ||
          job.title.toLowerCase().includes(keyword.toLowerCase())
        ) {
          hasKeyword = true;
          break;
        }
      }

      if (hasKeyword) {
        filtered.push(job);
      } */
    }

    console.log(
      `\n>>>>>>>>>> Filtered a total of: ${totalFiltered} jobs based on their description. <<<<<<<<<<\n`
    );

    this.setJobs(filtered);
  }

  filterOnTitle(): void {
    const filtered: LinkedinJob[] = [];

    for (const job of this.jobs) {
      if (this.#checkLatinCharacterCount(job.title)) {
        filtered.push(job);
      }
    }

    this.setJobs(filtered);
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

  abstract filterById(): Promise<void>;
}
