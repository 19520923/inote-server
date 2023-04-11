import mongoose, { Schema } from "mongoose";
import mongooseKeywords from "mongoose-keywords";

const noteSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    content: {
      type: String,
    },
    category: {
      type: Schema.ObjectId,
      ref: "Category",
    },
    opened_at: {
      type: Date,
      default: new Date(),
    },
    starred: {
      type: Boolean,
      default: false,
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

noteSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      title: this.title,
      icon: this.icon,
      content: this.content,
      category: this.category,
      opened_at: this.opened_at,
      starred: this.starred,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  },
};

noteSchema.plugin(mongooseKeywords, { paths: ["title"] });

const model = mongoose.model("Note", noteSchema);

export const schema = model.schema;
export default model;
