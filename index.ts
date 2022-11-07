import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import { DateTime } from "luxon";

const prisma = new PrismaClient();
// npx prisma migrate dev --name init
async function main() {
  // await prisma.reminder.deleteMany();
  // await prisma.user.deleteMany();

  const nowUtc = DateTime.utc().toJSDate();

  //await createUser(nowUtc);

  //const foundUser = await GetUser("alexbarke002@gmail.com");

  // await CreateReminder(
  //   nowUtc,
  //   foundUser?.id ?? "",
  //   "Walk the dog",
  //   3,
  //   DateTime.utc(2022, 10, 8, 3).toJSDate()
  // );

  const allUsers = await GetAllUsersAndReminders();
  console.dir(allUsers, { depth: null });
}

const createUser = async (nowUtc: Date, email: string, name: string) => {
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
  return prisma.user.findFirst({
    where: { email: "alexbarke002@gmail.com" },
    include: {
      reminders: true,
    },
  });
};

const CreateReminder = async (
  nowUtc: Date,
  userId: string,
  content: string,
  leadHours: number,
  dateDateUtc: Date
) => {
  await prisma.reminder.create({
    data: {
      id: v4(),
      created_at_utc: nowUtc,
      due_date_utc: dateDateUtc,
      due_date_lead_hours: leadHours,
      creator_id: userId,
      content,
    },
  });
};
const GetAllUsersAndReminders = async () =>
  prisma.user.findMany({
    include: {
      reminders: true,
    },
  });

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
