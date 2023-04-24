import mongoose, { Schema } from "mongoose";
import { REMINDER_REPEAT } from "../../constants";

const reminderSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    time: {
      type: Date,
      min: new Date(),
    },
    is_done: {
      type: Boolean,
      default: false,
    },
    is_remind: {
      type: Boolean,
      default: false,
    },
    deleted_flag: {
      type: Boolean,
      default: false,
    },
    repeat: {
      type: String,
      enum: REMINDER_REPEAT,
      default: "none",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const syncReminderSchema = new Schema({
  reminders: [{ type: reminderSchema, required: true }],
});

reminderSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      title: this.title,
      content: this.content,
      time: this.time,
      is_done: this.is_done,
      is_remind: this.is_remind,
      deleted_flag: this.deleted_flag,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  },
};

const model = mongoose.model("Reminder", reminderSchema);
const sync_model = mongoose.model("SyncReminder", syncReminderSchema);

export const schema = model.schema;
export const sync_schema = sync_model.schema;
export default model;
