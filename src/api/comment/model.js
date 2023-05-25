import mongoose, { Schema } from "mongoose";
import socket from "../../services/socket";
import { Task } from "../task";

const commentSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    is_system: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
    },
    task: {
      type: Schema.ObjectId,
      ref: "Task",
    },
    deleted_flag: {
      type: Boolean,
      default: false,
    },
    reply_to: {
      type: Schema.ObjectId,
      ref: "Comment",
    },
    to: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

commentSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "author reply_to to",
    options: { _recursed: true },
  });
  next();
});

commentSchema.post(/^save/, async function (child) {
  try {
    const task = await Task.findById(child.task);
    if (!child.populated("author reply_to to")) {
      await child
        .populate({
          path: "author reply_to to",
          options: { _recursed: true },
        })
        .execPopulate();
    }
    socket.to("comment:update", task.project.toString(), child.view());
  } catch (err) {
    console.log(err);
  }
});

commentSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      author: this.author.view(),
      content: this.content,
      task: this.task,
      deleted_flag: this.deleted_flag,
      is_system: this.is_system,
      created_at: this.created_at,
      updated_at: this.updated_at,
      reply_to: this.reply_to && this.reply_to.view(),
      to: this.to && this.to.map((user) => user.view()),
    };
  },
};

const model = mongoose.model("Comment", commentSchema);

export const schema = model.schema;
export default model;
