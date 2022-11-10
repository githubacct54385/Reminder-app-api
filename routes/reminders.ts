import express, { Request, Response } from "express";
import { DateTime } from "luxon";
import { PrismaClient } from "@prisma/client";
import ReminderServerModel from "../models/ReminderServerModel";
import ReminderToggleViewModel from "../models/ReminderToggleViewModel";
import ReminderViewModel from "../models/ReminderViewModel";
import ResponseModel from "../models/ResponseModel";
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

module.exports = router;
