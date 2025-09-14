import nodemailer, { Transporter } from "nodemailer";

export async function SendEmail(
  transporter: Transporter,
  emailText: string,
  config: EmailConfig
) {
  try {
    const info = await transporter.sendMail({
      sender: config.sender,
      to: config.receiver,
      subject: `Job report: ${new Date().toLocaleDateString()}`,
      text: emailText,
    });

    console.log(`Successfully sent message: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (e: unknown) {
    console.error("Error while sending mail", e);
  }
}
