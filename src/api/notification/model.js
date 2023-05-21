import mongoose, { Schema } from "mongoose";
import { NOTIFICATION_TYPES } from "../../constants";
import socket from "../../services/socket";

const notificationSchema = new Schema(
  {
    content: {
      type: String,
    },
    is_seen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
    },
    author: {
      type: Schema.ObjectId,
      ref: "User",
    },
    data: {
      type: String,
    },
    project: {
      type: String,
    },
    receiver: {
      type: Schema.ObjectId,
      ref: "User",
      index: true,
    },
    deleted_flag: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "author",
    options: { _recursed: true },
  });
  next();
});

notificationSchema.post(/^save/, async function (child) {
  try {
    socket.to("notification:create", child.receiver.toString(), child.view());
  } catch (err) {}
});

notificationSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      content: this.content,
      is_seen: this.is_seen,
      type: this.type,
      author: this.author.view(),
      data: this.data,
      project: this.project,
      receiver: this.receiver,
      created_at: this.created_at,
    };
  },
};

const model = mongoose.model("Notification", notificationSchema);

export const schema = model.schema;
export default model;
