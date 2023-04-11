import mongoose, { Schema } from "mongoose";
import { TASK_PRIORITY, TASK_STATUS } from "../../constants";
import mongooseKeywords from "mongoose-keywords";
import { Notification } from "../notification";
import socket from "../../services/socket";

const taskSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.ObjectId,
      ref: "Project",
      required: true,
    },
    parent: {
      type: Schema.ObjectId,
      ref: "Task",
    },
    key: {
      type: String,
      trim: true,
      index: true,
      unique: true,
    },
    description: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
    },
    registered_by: {
      type: Schema.ObjectId,
      ref: "User",
    },
    assignee: {
      type: Schema.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: TASK_STATUS,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY,
    },
    mileston: {
      type: Schema.ObjectId,
      ref: "Mileston",
    },
    estimate: {
      type: Number,
      min: 0,
    },
    actual: {
      type: Number,
      min: 0,
    },
    start_date: {
      type: Date,
      min: new Date(),
    },
    due_date: {
      type: Date,
      min: new Date(),
    },
    end_date: {
      type: Date,
    },
    opened_at: {
      type: Date,
      default: new Date(),
    },
    deleted_flag: {
      type: Boolean,
      default: false,
    },
    reminderFlag: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

taskSchema.virtual("children", {
  ref: "Task",
  localField: "id",
  foreignField: "parent",
  sort: { created_at: 1 },
});

taskSchema.path("assignee").set(function (assignee) {
  Notification.create({
    content: `${this.subject} (${this.key}) has been assigned to you`,
    author: this.registered_by,
    type: "task",
    receiver: assignee,
    data: this.id,
  });
  return assignee;
});

taskSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "author registered_by assignee mileston children",
    options: { _recursed: true },
  });
  next();
});

taskSchema.post(/^save/, async function (child) {
  try {
    if (!child.populated("author registered_by assignee mileston")) {
      const task = await child
        .populate({
          path: "author registered_by assignee mileston",
          options: { _recursed: true },
        })
        .execPopulate();
      socket.to("task:update", child.project, task.view(true));
    }
  } catch (err) {
    console.log(err);
  }
});

taskSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      subject: this.subject,
      key: this.key,
      priority: this.priority,
      status: this.status,
      registered_by: this.registered_by.view(),
      assignee: this.assignee.view(),
      reminderFlag: this.reminderFlag,
      due_date: this.due_date,
      mileston: this.mileston ? this.mileston.view() : this.mileston,
    };

    return full
      ? {
          ...view,
          start_date: this.start_date,
          author: this.author.view(),
          end_date: this.end_date,
          created_at: this.created_at,
          updated_at: this.updated_at,
          estimate: this.estimate,
          actual: this.actual,
          description: this.description,
          opened_at: this.opened_at,
          children: this.children
            ? this.children.map((child) => child.view())
            : this.children,
          parent: this.parent,
        }
      : view;
  },
};

taskSchema.plugin(mongooseKeywords, {
  paths: ["key", "subject"],
});
const model = mongoose.model("Task", taskSchema);

export const schema = model.schema;
export default model;
