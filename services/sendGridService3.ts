export default function () {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY must be defined.");
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const client = require("@sendgrid/mail");
  client.setApiKey(process.env.SENDGRID_API_KEY);

  const message = {
    from: {
      email: "alexbarke002@outlook.com",
    },
    replyTo: {
      email: "alexbarke002@outlook.com",
    },
    subject: "Reminder API",
    content: [
      {
        type: "text/html",
        value:
          "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>",
      },
    ],
  };

  client
    .send(message)
    .then((res: any) => console.log(`Mail sent successfully with res ${res}`))
    .catch((error: any) => {
      console.log(error);
    });
}
