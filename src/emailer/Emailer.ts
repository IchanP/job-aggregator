import nodemailer, { Transporter } from "nodemailer";

interface JobByLocation {
  [key: string]: Array<LinkedinJob>;
}

export class Emailer {
  #transporter: Transporter;
  #config: EmailConfig;

  constructor(transporter: Transporter, config: EmailConfig) {
    this.#transporter = transporter;
    this.#config = config;
  }

  buildEmail(jobs: Array<LinkedinJob>, keywords: Array<string>) {
    this.#addPriorityMark(jobs, keywords);
    const locationJobs = this.#divideByLocation(jobs);

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

  async sendEmail(emailText: string) {
    try {
      const info = await this.#transporter.sendMail({
        sender: this.#config.sender,
        to: this.#config.receiver,
        subject: `Job report: ${new Date().toLocaleDateString()}`,
        text: emailText,
      });

      console.log(`Successfully sent message: ${info.messageId}`);
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (e: unknown) {
      console.error("Error while sending mail", e);
    }
  }

  #divideByLocation(jobs: Array<LinkedinJob>): JobByLocation {
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

  #addPriorityMark(jobs: Array<LinkedinJob>, keywords: Array<string>) {
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
}
