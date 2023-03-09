import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isHide: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

categorySchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      name: this.name,
      isHide: this.isHide,
      order: this.order,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  },
};

const model = mongoose.model("Category", categorySchema);

export const schema = model.schema;
export default model;
