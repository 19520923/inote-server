import mongoose, { Schema } from "mongoose";
import { MESSAGE_TYPE } from "../../constants";
import socket from "../../services/socket";
import mongooseKeywords from "mongoose-keywords";

const messageSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.ObjectId,
      ref: "Project",
    },
    image: {
      type: String,
      default: "",
    },
    reply_to: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    content: {
      type: String,
    },
    deleted_flag: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: MESSAGE_TYPE,
      default: "text",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

messageSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "author reply_to",
    options: { _recursed: true },
  });
  next();
});

messageSchema.post(/^save/, async function (child) {
  try {
    if (!child.populated("author reply_to")) {
      await child
        .populate({
          path: "author reply_to",
          options: { _recursed: true },
        })
        .execPopulate();
    }

    socket.to("message:update", child.project.toString(), child.view(true));
  } catch (err) {
    console.log(err);
  }
});

messageSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      author: this.author.view(),
      project: this.project,
      reply_to: this.reply_to.map((e) => e.view()),
      content: this.content,
      deleted_flag: this.deleted_flag,
      type: this.type,
      created_at: this.created_at,
      updated_at: this.updated_at,
      image: this.image,
    };

    return full
      ? {
          ...view,
          // add properties for a full view
        }
      : view;
  },
};
messageSchema.plugin(mongooseKeywords, { paths: ["content"] });
const model = mongoose.model("Message", messageSchema);

export const schema = model.schema;
export default model;
