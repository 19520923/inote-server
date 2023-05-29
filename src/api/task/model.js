import mongoose, { Schema } from "mongoose";
import { TASK_PRIORITY, TASK_STATUS } from "../../constants";
import mongooseKeywords from "mongoose-keywords";
import { Notification } from "../notification";
import socket from "../../services/socket";
import _ from "lodash";

const taskSchema = new Schema(
  {
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
    content: {
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
      default: TASK_STATUS[0],
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY,
      default: TASK_PRIORITY[0],
    },
    milestone: {
      type: Schema.ObjectId,
      ref: "Milestone",
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
    },
    due_date: {
      type: Date,
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
    is_remind: {
      type: Boolean,
      default: true,
    },
    activity: {
      type: Schema.ObjectId,
      ref: "Activity",
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

taskSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "registered_by assignee milestone children activity",
    options: { _recursed: true },
  });
  next();
});

taskSchema.pre(/^save/, async function (next) {
  const changes = this.getChanges().$set;
  if (
    _.includes(Object.keys(changes), "assignee") &&
    changes["assignee"] !== this.assignee.id
  ) {
    console.log("changes assignee");
    await Notification.create({
      content: `${this.subject} (${this.key}) has been assigned to you`,
      author: this.registered_by,
      type: "task",
      receiver: changes["assignee"],
      data: this.id,
      project: this.project,
    });
  }
});

taskSchema.post(/^save/, async function (child) {
  try {
    if (!child.populated("registered_by assignee milestone activity")) {
      await child
        .populate({
          path: "registered_by assignee milestone activity",
          options: { _recursed: true },
        })
        .execPopulate();
    }
    socket.to("task:update", child.project.toString(), child.view(true));
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
      registered_by: this.registered_by
        ? this.registered_by.view()
        : this.registered_by,
      assignee: this.assignee && this.assignee.view(),
      is_remind: this.is_remind,
      due_date: this.due_date,
      milestone: this.milestone && this.milestone.view(),
      project: this.project,
    };

    return full
      ? {
          ...view,
          start_date: this.start_date,
          end_date: this.end_date,
          created_at: this.created_at,
          updated_at: this.updated_at,
          estimate: this.estimate,
          actual: this.actual,
          content: this.content,
          opened_at: this.opened_at,
          children: this.children
            ? this.children.map((child) => child.view())
            : this.children,
          parent: this.parent,
          activity: this.activity && this.activity.view(),
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
