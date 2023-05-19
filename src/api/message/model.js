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
    reply_to: {
      type: Schema.ObjectId,
      ref: "Message",
    },
    content: {
      type: String,
    },
    deleted_flag: {
      type: Boolean,
      default: false,
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

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author reply_to to",
  });
  next();
});

messageSchema.post(/^save/, async function (child) {
  try {
    if (!child.populated("author reply_to to")) {
      await child
        .populate({
          path: "author reply_to to",
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
      content: this.content,
      deleted_flag: this.deleted_flag,
    };

    return full
      ? {
          ...view,
          project: this.project,
          created_at: this.created_at,
          updated_at: this.updated_at,
          image: this.image,
          reply_to: this.reply_to && this.reply_to.view(),
          to: this.to.map((e) => e.view()),
          // add properties for a full view
        }
      : view;
  },
};
messageSchema.plugin(mongooseKeywords, { paths: ["content"] });
const model = mongoose.model("Message", messageSchema);

export const schema = model.schema;
export default model;
