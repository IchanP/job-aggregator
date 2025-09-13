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
  linkedInParams: LinkedInConfig;
}
