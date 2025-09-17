interface Filterer {
  filterOnPhrase: (phrases: Array<string>) => Array<LinkedinJob>;
  filterOnTitle: () => Array<LinkedinJob>;
  setJobs: (jobs: LinkedinJob[]) => void;
  filterById: (jobs: LinkedinJob[]) => Promise<Array<LinkedinJob>>;
}

interface JobFetcher {
  fetchJobs(): Promise<Array<LinkedinJob>>;
}
