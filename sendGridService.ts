import { DateTime } from "luxon";
import RecipientEmailModel from "./models/RecipientEmailModel";
import ReminderSendDueServerModel from "./models/ReminderSendDueServerModel";
import sgMail from "@sendgrid/mail";

const SendEmails = async (
  recipients: RecipientEmailModel[]
): Promise<ReminderSendDueServerModel> => {
  console.log("SendEmails...");
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  if (!sendGridApiKey) {
    throw new Error("SENDGRID_API_KEY not defined.");
  }
  const from = process.env.SENDGRID_VERIFIED_SENDER;
  if (!from) {
    throw new Error("SENDGRID_VERIFIED_SENDER not defined.");
  }
  console.log("set api key");
  sgMail.setApiKey(sendGridApiKey);
  recipients.forEach(async (r) => {
    try {
      console.log("sending...");
      const sendRes = await sgMail.send(
        {
          from: from,
          to: "alexbarke002@gmail.com" ?? r.email,
          text:
            "hey there" ??
            `You have a reminder due at ${DateTime.fromJSDate(
              r.dueDateUtc
            ).toFormat("ddd dd MMMM hh:mm yyyy")}.  The reminder content is ${
              r.content
            }`,
        },
        false,
        (error, res) => {
          console.log("callback");
          if (error) {
            console.error({ error });
          }
          if (res) {
            console.log({ res });
          }
        }
      );
      console.log({ sendRes });
    } catch (error) {
      console.log(`oops I had an error`);
      console.error(error);
      return {
        msg: "failed to send",
        success: false,
        recipients,
      };
    }
  });

  return {
    msg: "",
    recipients,
    success: true,
  };
};

export default SendEmails;
