import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import { DateTime } from "luxon";

import express from "express";
const app = express();
const cors = require("cors");
import { expressjwt, Request as JWTRequest } from "express-jwt";
const jwks = require("jwks-rsa");

const PORT = process.env.PORT || 3000;

const jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-mrtdtl5v5f22pdok.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://reminders-api",
  issuer: "https://dev-mrtdtl5v5f22pdok.us.auth0.com/",
  algorithms: ["RS256"],
});

app.use(jwtCheck);
app.use(
  cors({
    origin: ["http://localhost", "http://localhost:8080"],
  })
);

app.get("/", async (req, res) => {
  res.send("hi");
});

app.get("/reminders", async (req, res) => {
  console.log("called");
  const { email } = req.query;
  const user = await GetUser(email as string);
  res.json(user);
});

app.post("/reminders", async (req, res) => {
  res.send(req.body);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// // npx prisma migrate dev --name init
// async function main() {
//   // await prisma.reminder.deleteMany();
//   // await prisma.user.deleteMany();

//   const nowUtc = DateTime.utc().toJSDate();

//   //await createUser(nowUtc);

//   //const foundUser = await GetUser("alexbarke002@gmail.com");

//   // await CreateReminder(
//   //   nowUtc,
//   //   foundUser?.id ?? "",
//   //   "Walk the dog",
//   //   3,
//   //   DateTime.utc(2022, 10, 8, 3).toJSDate()
//   // );

//   const allUsers = await GetAllUsersAndReminders();
//   console.dir(allUsers, { depth: null });
// }

const createUser = async (nowUtc: Date, email: string, name: string) => {
  const prisma = new PrismaClient();
  await prisma.user.create({
    data: {
      id: v4(),
      email,
      name,
      created_at_utc: nowUtc,
    },
  });
};

const GetUser = async (email: string) => {
  const prisma = new PrismaClient();
  return prisma.user.findFirst({
    where: { email },
    include: {
      reminders: true,
    },
  });
};

// const CreateReminder = async (
//   nowUtc: Date,
//   userId: string,
//   content: string,
//   leadHours: number,
//   dateDateUtc: Date
// ) => {
//   await prisma.reminder.create({
//     data: {
//       id: v4(),
//       created_at_utc: nowUtc,
//       due_date_utc: dateDateUtc,
//       due_date_lead_hours: leadHours,
//       creator_id: userId,
//       content,
//     },
//   });
// };
// const GetAllUsersAndReminders = async () =>
//   prisma.user.findMany({
//     include: {
//       reminders: true,
//     },
//   });

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
