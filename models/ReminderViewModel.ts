export default interface ReminderViewModel {
  content: string;
  email: string;
  dueDateUtc: Date;
  dueDateTime: string;
  dueDateAlert: DueDateOption;
  utcOffset: number;
}

type DueDateOption =
  | "None"
  | "5m"
  | "10m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "1d"
  | "2d"
  | "1w";
