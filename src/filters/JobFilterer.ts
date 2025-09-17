export interface Filterer {
  filterOnPhrase: () => void;
  filterOnTitle: () => void;
  filterById: () => Promise<void>;
  filterUnique: () => LinkedinJob[];
  setJobs: (jobs: LinkedinJob[]) => void;
  getJobs(): LinkedinJob[];
}

// TODO clean up this so we don't set the jobs on every func call...

export abstract class JobFilterer implements Filterer {
  protected jobs: LinkedinJob[] = [];
  private filteredWords: Array<string>;

  constructor(blacklist: string[]) {
    this.filteredWords = blacklist;
  }

  setJobs(jobs: LinkedinJob[]) {
    // TODO do some verification?
    this.jobs = jobs;
  }

  getJobs() {
    return Array.from(this.jobs); // Don't care that it's a shallow copy.
  }

  filterUnique(): LinkedinJob[] {
    const unique = this.jobs.filter(
      (value, index, self) =>
        self.findIndex((v) => v.jobId === value.jobId) === index
    );
    const removedJobs = this.jobs.length - unique.length;
    console.log(`\nFiltered a total of ${removedJobs} duplicate jobs.`);
    return unique;
  }

  filterOnPhrase(): void {
    console.log(
      `Starting process of filtering ${this.jobs.length} jobs basesd on their description.`
    );

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
