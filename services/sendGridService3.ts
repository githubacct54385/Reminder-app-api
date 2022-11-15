import { DateTime } from "luxon";
import { MailContent } from "@sendgrid/helpers/classes/mail";
import client from "@sendgrid/mail";

type SendEmailResult = {
  success: boolean;
  msg: string;
};

const SendEmail = async (
  to: string,
  dueDate: Date,
  content: string
): Promise<SendEmailResult> => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY is missing from environment variables");
    return {
      msg: "failed to send email",
      success: false,
    };
  }
  client.setApiKey(process.env.SENDGRID_API_KEY);
  if (!process.env.SENDGRID_VERIFIED_SENDER) {
    console.error(
      "SENDGRID_VERIFIED_SENDER is missing from environment variables"
    );
    return {
      msg: "failed to send email",
      success: false,
    };
  }
  const myContent: MailContent[] & { 0: MailContent } = [
    {
      type: "text/html",
      value: `<p>You have a due reminder.</p><p>Due Date: ${DateTime.fromJSDate(
        dueDate
      ).toLocaleString(DateTime.DATETIME_MED)}</p><p>Content: ${content}</p>`,
    },
  ];
  const message = {
    personalizations: [
      {
        to: [
          {
            email: to,
          },
        ],
      },
    ],
    from: {
      email: process.env.SENDGRID_VERIFIED_SENDER,
    },
    replyTo: {
      email: process.env.SENDGRID_VERIFIED_SENDER,
    },
    subject: "Reminder API -- Due Reminder",
    content: myContent,
  };
  try {
    const res = await client.send(message);
    if (res?.[0]?.statusCode === 202) {
      return {
        success: true,
        msg: "",
      };
    }
    return {
      msg: "failed to send email",
      success: false,
    };
  } catch (error) {
    console.error(error);
    return {
      msg: "failed to send email",
      success: false,
    };
  }
};

export default SendEmail;
