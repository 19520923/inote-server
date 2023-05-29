import mongoose, { Schema } from "mongoose";
import socket from "../../services/socket";

const activitySchema = new Schema(
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
    name: {
      type: String,
    },
    order: {
      type: Number,
    },
    delete_flag: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

activitySchema.post(/^save/, async function (child) {
  try {
    socket.to("activity:update", child.project.toString(), child.view());
  } catch (err) {
    console.log(err);
  }
});

activitySchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      name: this.name,
      project: this.project,
      order: this.order,
      delete_flag: this.delete_flag,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  },
};

const model = mongoose.model("Activity", activitySchema);

export const schema = model.schema;
export default model;
