import ReminderValidator from "../validators/createReminder";
import ReminderViewModel from "../models/ReminderViewModel";

export default function Validate(reminderViewModel: ReminderViewModel) {
  const createReminderValidator = new ReminderValidator();
  const validationResult = createReminderValidator.validate(reminderViewModel);

  const { content, dueDateAlert, dueDateUtc, email, utcOffset, dueDateTime } =
    validationResult;

  if (
    content ||
    dueDateAlert ||
    dueDateUtc ||
    email ||
    utcOffset ||
    dueDateTime
  ) {
    return [content, dueDateAlert, dueDateUtc, email, utcOffset, dueDateTime]
      .filter((p) => p)
      .join(",");
  }

  return null;
}
