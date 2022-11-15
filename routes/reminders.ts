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
    const { content, email, dueDateUtc, dueDateAlert, utcOffset } = req.body;
    try {
      const reminder = await prisma.reminder.create({
        data: {
          content,
          created_at_utc: DateTime.utc().toJSDate(),
          creator_email: email,
          due_date_utc: dueDateUtc,
          id: v4(),
          due_date_alert: dueDateAlert ?? "None",
          utc_offset: utcOffset,
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
          due_offset: r.utc_offset,
        };
      });
      const promiseArray = await Promise.all(
        emails.map(async (e) => {
          return await SendEmail(
            e.email,
            e.dueDateUtc,
            e.content,
            e.due_offset
          );
        })
      );
      if (promiseArray.every((p) => p.success)) {
        res.status(202).json({
          data: emails,
          msg: "",
          success: true,
        });
      } else {
        res.status(400).json({
          data: emails,
          msg: promiseArray[0].msg,
          success: false,
        });
      }
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
