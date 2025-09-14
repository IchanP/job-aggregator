interface JobByLocation {
  [key: string]: Array<LinkedinJob>;
}

export function BuildEmail(jobs: Array<LinkedinJob>, keywords: Array<string>) {
  AddPriorityMark(jobs, keywords);
  const locationJobs = DivideByLocation(jobs);

  const currentDate = new Date().toLocaleDateString();
  let emailText = `This report was generated and sent on the ${currentDate}\n`;

  for (const [city, jobs] of Object.entries(locationJobs)) {
    emailText += `\n 📍 ${city}\n`; // TODO possible to make this bigger?
    for (const job of jobs) {
      const priority = job.priority ? `✨` : "";
      emailText += `${priority} ${job.title}: ${job.url}\n`;
    }
  }

  return emailText;
}

function DivideByLocation(jobs: Array<LinkedinJob>): JobByLocation {
  const byLocation: JobByLocation = {};

  for (const job of jobs) {
    const city = job.location.split(",")[0];

    if (!byLocation[city]) {
      byLocation[city] = [];
    }

    byLocation[city].push(job);
  }

  return byLocation;
}

function AddPriorityMark(jobs: Array<LinkedinJob>, keywords: Array<string>) {
  for (const job of jobs) {
    let hasKeyword = false;
    if (hasKeyword) {
      continue;
    }
    for (const keyword of keywords) {
      if (
        (job.description &&
          job.description.toLowerCase().includes(keyword.toLowerCase())) ||
        job.title.toLowerCase().includes(keyword.toLowerCase())
      ) {
        job.priority = true;
        hasKeyword = true;
        break;
      }
    }
  }
}
