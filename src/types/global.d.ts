interface LinkedinSQLRow {
  id: number;
  exactDate: string;
}

interface LinkedInConfig {
  experience: string; // Matches the experience field on LinkedIn internship, entry_level, associate, mid_senior, director
  keyword: string;
  timePosted: string;
  location: string;
}

interface Config {
  blacklist: Array<string>;
  linkedInParams: Array<LinkedInConfig>;
  keywords: Array<string>;
  emailConfig: EmailConfig;
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
