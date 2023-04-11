import mongoose, { Schema } from "mongoose";

const verifyCodeSchema = new Schema(
  {
    user_id: String,
    email: String,
    code: Number,
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
      code: this.code,
      status: this.status,
    };
  },
};

const model = mongoose.model("VerifyCode", verifyCodeSchema);

export const schema = model.schema;
export default model;
