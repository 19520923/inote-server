import mongoose, { Schema } from "mongoose";
import socket from "../../services/socket";

const milestoneSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
    },
    project: {
      type: Schema.ObjectId,
      ref: "Project",
      required: true,
    },
    deleted_flag: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

milestoneSchema.post(/^save/, async function (child) {
  try {
    socket.to("milestone:update", child.project.toString(), child.view());
  } catch (err) {
    console.log(err);
  }
});

milestoneSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      name: this.name,
      order: this.order,
      project: this.project,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  },
};

const model = mongoose.model("Milestone", milestoneSchema);

export const schema = model.schema;
export default model;
