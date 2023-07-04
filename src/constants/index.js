export const USER_ROLES = ["user", "admin"];
export const USER_GENDER = ["male", "female", "others"];
export const NOTIFICATION_TYPES = ["note", "task", "project", "chat", "system"];
export const PROJECT_STATUS = [
  "upcoming",
  "pending",
  "overdue",
  "not starred",
  "active",
  "priority",
  "canceled",
];
export const TASK_STATUS = [
  "open",
  "in_progress",
  "pending",
  "resolved",
  "closed",
];
export const TASK_PRIORITY = ["low", "normal", "high", "important"];
export const REMINDER_REPEAT = ["none", "week", "day", "month", "year"];
export const MESSAGE_TYPE = ["text", "image", "quote", "video"];
export const NOTE_TYPE = ["text", "draw"];

export const mongooseObjectID = /^[0-9a-fA-F]{24}$/;

export const DATE_FORMAT = "DD/MM/yyyy";
