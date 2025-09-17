interface LinkedinSQLRow {
  id: number;
  exactDate: string;
}

interface LinkedinApiParams {
  experience: string; // Matches the experience field on LinkedIn internship, entry_level, associate, mid_senior, director
  keyword: string;
  timePosted: string;
  location: string;
}

interface LinekdInConfig {
  call: boolean;
  linkedInParams: Array<LinkedinApiParams>;
}

// Arbetsförmedlingen config
interface AfConfig {
  call: boolean;
  // TODO add params here...
}

interface EmailConfig {
  service: string;
  sender: string;
  receiver: string;
}

interface LinkedinJob {
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
  description?: string;
  priority?: boolean;
}

interface Config {
  blacklist: Array<string>;
  linkedInConfig: LinekdInConfig;
  keywords: Array<string>;
  emailConfig: EmailConfig;
}

interface JobFetcher {
  fetchJobs(): Promise<Array<LinkedinJob>>;
}
