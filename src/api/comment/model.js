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
    content: {
      type: String,
    },
    task: {
      type: Schema.ObjectId,
      ref: "Task",
    },
    deleteFlag: {
      type: Boolean,
      default: false,
    },
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
    path: "author",
    options: { _recursed: true },
  });
  next();
});

commentSchema.post(/^save/, async function (child) {
  try {
    const task = await Task.findById(child.task);
    if (!child.populated("author")) {
      const comment = await child
        .populate({
          path: "author",
          options: { _recursed: true },
        })
        .execPopulate();
      socket.to("comment:update", task.project, comment.view());
    }
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
      deleteFlag: this.deleteFlag,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  },
};

const model = mongoose.model("Comment", commentSchema);

export const schema = model.schema;
export default model;
