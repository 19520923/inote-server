import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    is_hide: {
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

const syncCategoriesSchema = new Schema({
  // categories: [{ type: categorySchema, required: true }],
  categories: [{ type: categorySchema, required: true }],
});

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
const sync_model = mongoose.model("SyncCategory", syncCategoriesSchema);

export const schema = model.schema;
export const sync_schema = sync_model.schema;
export default model;
