interface JobFetcher {
  board: JobBoards;
  fetchJobs(): Promise<Array<LinkedinJob>>;
  getUniqueJobs(): LinkedinJob[];
}
