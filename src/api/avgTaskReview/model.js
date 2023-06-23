import mongoose, { Schema } from "mongoose";

const avgTaskReviewSchema = new Schema(
  {
    task: {
      type: Schema.ObjectId,
      ref: "Task",
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
    },
    avg_point: {
      type: Number,
    },
  },
  { timestamps: true }
);

avgTaskReviewSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    return full
      ? {
          ...view,
          // add properties for a full view
        }
      : view;
  },
};

const model = mongoose.model("AvgTaskReview", avgTaskReviewSchema);

export const schema = model.schema;
export default model;
