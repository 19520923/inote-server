import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
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

activitySchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      author: this.author.view(full),
      name: this.name,
      order: this.order,
      delete_flag: this.delete_flag,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    
  },
};

const model = mongoose.model("Activity", activitySchema);

export const schema = model.schema;
export default model;
