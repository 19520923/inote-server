import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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

jobSchema.methods = {
  view() {
    return {
      id: this.id,
      name: this.name,
      deleteFlag: this.deleteFlag,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  },
};

const model = mongoose.model("Job", jobSchema);

export const schema = model.schema;
export default model;
