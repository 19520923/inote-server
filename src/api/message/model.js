import mongoose, { Schema } from "mongoose";
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
    images: [String],
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
    is_edited: {
      type: Boolean,
    },
    is_pinned: {
      type: Boolean,
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
    path: "author reply_to to",
    options: { _recursed: true },
    populate: "author",
  });
  next();
});

messageSchema.post(/^save/, async function (child) {
  try {
    if (!child.populated("author reply_to to")) {
      await child
        .populate({
          path: "author reply_to to",
          options: { _recursed: true },
          populate: "author",
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
          images: this.images,
          reply_to: this.reply_to && this.reply_to.view(),
          to: this.to.map((e) => e.view()),
          is_edited: this.is_edited,
          is_pinned: this.is_pinned,
          // add properties for a full view
        }
      : view;
  },
};
messageSchema.plugin(mongooseKeywords, { paths: ["content"] });
const model = mongoose.model("Message", messageSchema);

export const schema = model.schema;
export default model;
