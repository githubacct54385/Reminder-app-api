import RecipientEmailModel from "./RecipientEmailModel";

export default interface ReminderSendDueServerModel {
  recipients: RecipientEmailModel[];
  success: boolean;
  msg: string;
}
