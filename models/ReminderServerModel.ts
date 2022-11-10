export default interface ReminderServerModel {
  id: string;
  creator_name?: string | null;
  creator_email: string;
  created_at_utc: Date | string;
  updated_at_utc?: Date | string | null;
  due_date_utc: Date | string;
  due_date_alert?: string;
  content: string;
  is_completed: boolean;
  is_deleted: boolean;
}
