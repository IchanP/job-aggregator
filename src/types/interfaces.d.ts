interface JobFetcher {
  fetchJobs(): Promise<Array<LinkedinJob>>;
  getUniqueJobs(): LinkedinJob[];
}
