import express, { Request, Response } from "express";
import { DateTime } from "luxon";
import { PrismaClient } from "@prisma/client";
import RecipientEmailModel from "../models/RecipientEmailModel";
import ReminderDeleteViewModel from "../models/ReminderDeleteViewModel";
import ReminderSendDueRequestModel from "../models/ReminderSendDueRequestModel";
import ReminderServerModel from "../models/ReminderServerModel";
import ReminderToggleViewModel from "../models/ReminderToggleViewModel";
import ReminderViewModel from "../models/ReminderViewModel";
import ResponseModel from "../models/ResponseModel";
import SendEmail from "../services/sendGridService3";
import { v4 } from "uuid";
const router = express.Router();

const prisma = new PrismaClient();

// get all reminders by user email
router.get(
  "/byEmail/:email",
  async (
    req: Request<{ email: string }, unknown, unknown>,
    res: Response<ResponseModel<ReminderServerModel[]>>
  ) => {
    try {
      const { email } = req.params;
      if (!email) {
        res.status(200).json({
          success: true,
          msg: "no reminders for email",
          data: [],
        });
        return;
      }
      const reminders = await prisma.reminder.findMany({
        where: {
          creator_email: email,
          is_deleted: false,
        },
        orderBy: [
          {
            due_date_utc: "desc",
          },
          {
            is_completed: "desc",
          },
        ],
      });
      res.status(200).json({
        success: true,
        msg: "",
        data: reminders,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        msg: "Error while getting reminders by email",
        data: [],
      });
    }
  }
);

router.post(
  "/create",
  async (
    req: Request<unknown, unknown, ReminderViewModel>,
    res: Response<ResponseModel<ReminderServerModel>>
  ) => {
    const { content, email, dueDateUtc, dueDateAlert } = req.body;
    try {
      const reminder = await prisma.reminder.create({
        data: {
          content,
          created_at_utc: DateTime.utc().toJSDate(),
          creator_email: email,
          due_date_utc: dueDateUtc,
          id: v4(),
          due_date_alert: dueDateAlert ?? "None",
        },
      });
      res.status(201).json({
        success: true,
        data: reminder,
        msg: "",
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        data: null,
        msg: `failed to create reminder due to internal error.`,
      });
    }
  }
);

router.patch(
  "/toggleIsCompleted",
  async (
    req: Request<unknown, unknown, ReminderToggleViewModel>,
    res: Response<ResponseModel<ReminderServerModel>>
  ) => {
    try {
      const { id, isCompleted } = req.body;
      const reminder = await prisma.reminder.update({
        where: {
          id,
        },
        data: {
          is_completed: !isCompleted,
        },
      });

      res.status(200).json({
        success: true,
        msg: "",
        data: reminder,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: true,
        msg: "toggle reminder action failed",
        data: null,
      });
    }
  }
);

router.delete(
  "/",
  async (
    req: Request<unknown, unknown, ReminderDeleteViewModel>,
    res: Response<ResponseModel<ReminderServerModel>>
  ) => {
    try {
      const { id } = req.body;
      const reminder = await prisma.reminder.update({
        where: {
          id,
        },
        data: {
          is_deleted: true,
        },
      });

      res.status(200).json({
        success: true,
        msg: "",
        data: reminder,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: true,
        msg: "delete reminder action failed",
        data: null,
      });
    }
  }
);

router.post(
  "/send-due",
  async (
    req: Request<unknown, unknown, ReminderSendDueRequestModel>,
    res: Response<ResponseModel<RecipientEmailModel[]>>
  ) => {
    try {
      const { reminderIds } = req.body;
      const remindersDueToSend = await prisma.reminder.findMany({
        where: {
          id: {
            in: reminderIds,
          },
          is_deleted: false,
          is_completed: false,
        },
      });

      if (!remindersDueToSend || !remindersDueToSend.some((x) => x)) {
        res.status(404).json({
          success: false,
          msg: "Could not find due reminders to send",
          data: [],
        });
        return;
      }
      const emails = remindersDueToSend.map((r) => {
        return {
          id: r.id,
          email: r.creator_email,
          content: r.content,
          dueDateUtc: r.due_date_utc,
        };
      });
      const result = await SendEmail(
        "alexbarke002@gmail.com",
        remindersDueToSend[0].due_date_utc,
        "Walk the dog"
      );
      if (result.success) {
        res.status(202).json({
          data: [
            {
              id: "11111111-1111-1111-1111-111111111111",
              content: "Walk the dog",
              dueDateUtc: new Date(Date.UTC(2022, 10, 15, 3, 42)),
              email: "alexbarke002@gmail.com",
            },
          ],
          msg: "",
          success: true,
        });
      } else {
        res.status(400).json({
          data: [
            {
              id: "11111111-1111-1111-1111-111111111111",
              content: "Walk the dog",
              dueDateUtc: new Date(Date.UTC(2022, 10, 15, 3, 42)),
              email: "alexbarke002@gmail.com",
            },
          ],
          msg: result.msg,
          success: false,
        });
      }
      // client.setApiKey(process.env.SENDGRID_API_KEY);

      // const fromEmail = "alexbarke002@outlook.com";
      // const toEmail = "alexbarke002@gmail.com";

      // const myContent: MailContent[] & { 0: MailContent } = [
      //   {
      //     type: "text/html",
      //     value: "<p>Hello my name is alex barke.</p>",
      //   },
      // ];

      // const message = {
      //   personalizations: [
      //     {
      //       to: [
      //         {
      //           email: toEmail,
      //         },
      //       ],
      //     },
      //   ],
      //   from: {
      //     email: fromEmail,
      //   },
      //   replyTo: {
      //     email: fromEmail,
      //   },
      //   subject: "Reminder API",
      //   content: myContent,
      // };

      // client
      //   .send(message)
      //   .then((response: any) => {
      //     console.log(`Mail sent successfully with res ${response}`);
      //     res.status(202).json({
      //       data: [],
      //       msg: "",
      //       success: true,
      //     });
      //   })
      //   .catch((error: any) => {
      //     console.log(error);
      //     // console.error(error.response.body);
      //     res.status(400).json({
      //       success: false,
      //       msg: "Error while sending due reminders",
      //       data: [],
      //     });
      //   });
      //SendEmails3();
      // remindersDueToSend.forEach(
      //   async (r) =>
      //     await SendEmails2(r.creator_email, r.due_date_utc, r.content)
      // );
      //await SendEmails2();
      // res.status(202).json({
      //   data: [],
      //   msg: "",
      //   success: true,
      // });
      //const response = await SendEmails(emails);
      // res.status(response.success ? 200 : 400).json({
      //   success: response.success,
      //   msg: response.success ? "" : "failed to send emails",
      //   data: response.recipients,
      // });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        msg: "Error while sending due reminders",
        data: [],
      });
    }
  }
);

router.get(
  "/due-reminders",
  async (
    _: Request<unknown, unknown, unknown>,
    res: Response<ResponseModel<ReminderServerModel[]>>
  ) => {
    try {
      const reminders = await prisma.reminder.findMany({
        where: {
          is_deleted: false,
          is_completed: false,
          due_date_utc: {
            lt: DateTime.now().toUTC().toJSDate(),
          },
        },
        orderBy: [
          {
            due_date_utc: "desc",
          },
        ],
      });
      res.status(200).json({
        success: true,
        msg: "",
        data: reminders,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        msg: "Error while getting due reminders",
        data: [],
      });
    }
  }
);

export default router;
