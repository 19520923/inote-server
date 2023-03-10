import mongoose, { Schema } from "mongoose";
import { NOTIFICATION_TYPES } from "../../constants";

const notificationSchema = new Schema(
  {
    content: {
      type: String,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
    },
    isSystem: {
      type: Boolean,
      default: true,
    },
    author: {
      type: Schema.ObjectId,
      ref: "User",
    },
    data: {
      type: String,
    },
    receiver: {
      type: Schema.ObjectId,
      ref: "User",
      index: true,
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

notificationSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      content: this.content,
      isSeen: this.isSeen,
      type: this.type,
      isSystem: this.isSystem,
      author: this.author.view(),
      data: this.data,
      receiver: this.receiver,
      created_at: this.created_at,
    };
  },
};

const model = mongoose.model("Notification", notificationSchema);

export const schema = model.schema;
export default model;
