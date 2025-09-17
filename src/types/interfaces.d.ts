interface Filterer {
  filterOnPhrase: (phrases: Array<string>) => void;
  filterOnTitle: () => void;
  setJobs: (jobs: LinkedinJob[]) => void;
  filterById: () => Promise<void>;
}

interface JobFetcher {
  fetchJobs(): Promise<Array<LinkedinJob>>;
}
