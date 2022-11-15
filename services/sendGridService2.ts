import { DateTime } from "luxon";
import sgMail from "@sendgrid/mail";

const SendEmail = (
  to: string,
  dueDateUtc: Date,
  content: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY must be defined.");
    }
    if (!process.env.SENDGRID_VERIFIED_SENDER) {
      throw new Error("SENDGRID_VERIFIED_SENDER must be defined.");
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from: process.env.SENDGRID_VERIFIED_SENDER, // Use the email address or domain you verified above
      subject: "heyo heyo" ?? "Reminder Due",
      text:
        "whaaaazzzaaap" ??
        `You have a due reminder.  Due Date: ${DateTime.fromJSDate(dueDateUtc)
          .plus({ hours: 8 })
          .toISODate()} with content: ${content}`,
      html:
        `<p>"whaaaazzzaaap"</p>` ??
        `<strong>You have a due reminder.  Due Date: ${DateTime.fromJSDate(
          dueDateUtc
        ).toISODate()} with content: ${content}</strong>`,
    };
    // try {
    console.log({ msg });
    sgMail
      .send(msg)
      .then((apiSuccess) => {
        console.log({ apiSuccess });
        resolve();
      })
      .catch((error: any) => {
        console.error({ error });
        reject();
      });
  });
};

export default SendEmail;
