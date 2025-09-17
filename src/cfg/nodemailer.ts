import nodemailer from "nodemailer";

export function createEmailTransporter(config: EmailConfig) {
  const transporter = nodemailer.createTransport({
    service: config.service,
    auth: {
      user: config.sender,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  transporter
    .verify()
    .then(() => console.log("Successfully connected to the email service.\n"))
    .catch(() => {
      console.error("Failed to connect to the email service. Exiting...");
      process.exit(1);
    });

  return transporter;
}
