import express from "express";
const reminders = require("./routes/reminders");
const app = express();
const cors = require("cors");
import { expressjwt } from "express-jwt";
import { exit } from "process";
const jwks = require("jwks-rsa");
require("dotenv").config({ path: "./.env" });

const PORT = process.env.PORT || 3000;

const jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKSURI,
  }),
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ["RS256"],
});

app.use(jwtCheck);

const origins = process.env.ORIGINS;
if (!origins) {
  console.error(
    `Origins value cannot be undefined.  Origins should be a comma-separated list of origins.  Please fix.`
  );
  exit(1);
}
const splitOrigins = origins.split(",");
app.use(
  cors({
    origin: splitOrigins,
  })
);
// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use("/reminders", reminders);

// app.post("/reminders", async (req, res) => {
//   const remindersForUser = await prisma.reminder.findMany({
//     where: {
//       creator: {
//         email: req.body.email,
//       },
//     },
//   });
//   res.json(remindersForUser);
// });

// app.get("/users", async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

// app.post("/user-creation", async (req, res) => {
//   const { email, name } = req.body;
//   const user = await prisma.user.create({
//     data: {
//       created_at_utc: DateTime.utc().toJSDate(),
//       email,
//       id: v4(),
//       name,
//     },
//   });
//   res.json(user);
// });

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

// const createUser = async (nowUtc: Date, email: string, name: string) => {
//   const prisma = new PrismaClient();
//   await prisma.user.create({
//     data: {
//       id: v4(),
//       email,
//       name,
//       created_at_utc: nowUtc,
//     },
//   });
// };

// const GetUser = async (email: string) => {
//   const prisma = new PrismaClient();
//   return prisma.user.findFirst({
//     where: { email },
//     include: {
//       reminders: true,
//     },
//   });
// };

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
