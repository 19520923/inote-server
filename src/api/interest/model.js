import mongoose, { Schema } from "mongoose";

const interestSchema = new Schema(
  {
    name: {
      type: String,
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

interestSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      name: this.name,
      deleted_flag: this.deleted_flag,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  },
};

const model = mongoose.model("Interest", interestSchema);

export const schema = model.schema;
export default model;
