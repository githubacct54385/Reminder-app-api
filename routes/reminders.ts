import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { v4 } from "uuid";
import express from "express";
const router = express.Router();

const prisma = new PrismaClient();

// get all reminders by user email
router.get("/byEmail/:email", async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      res.status(200).json({
        success: true,
        msg: "no reminders for email",
        reminders: [],
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
      reminders,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      msg: "Error while getting reminders by email",
      reminders: [],
    });
  }
});

router.post("/create", async (req, res) => {
  const { content, email, dueDate } = req.body;
  try {
    const reminder = await prisma.reminder.create({
      data: {
        content,
        created_at_utc: DateTime.utc().toJSDate(),
        creator_email: email,
        due_date_utc: dueDate,
        id: v4(),
      },
    });
    res.status(201).json({
      success: true,
      reminder,
      msg: "",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      reminder: null,
      msg: `failed to create reminder due to internal error.`,
    });
  }
});

router.patch("/toggleIsCompleted", async (req, res) => {
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
      reminder,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: true,
      msg: "toggle reminder action failed",
      reminder: null,
    });
  }
});

module.exports = router;
