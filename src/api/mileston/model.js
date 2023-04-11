import mongoose, { Schema } from "mongoose";

const milestonSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

milestonSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      title: this.title,
    };
  },
};

const model = mongoose.model("Mileston", milestonSchema);

export const schema = model.schema;
export default model;
