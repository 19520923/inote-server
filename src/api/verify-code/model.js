import mongoose, { Schema } from "mongoose";

const verifyCodeSchema = new Schema(
  {
    user_id: String,
    email: String,
    code: {
      type: Number,
      index: true,
      default: () => Math.floor(100000 + Math.random() * 900000),
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

verifyCodeSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      user_id: this.user_id,
      status: this.status,
    };
  },
};

const model = mongoose.model("VerifyCode", verifyCodeSchema);

export const schema = model.schema;
export default model;
