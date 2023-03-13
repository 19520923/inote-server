import mongoose, { Schema } from "mongoose";
import mongooseKeywords from "mongoose-keywords";
import { PROJECT_STATUS } from "../../constants";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
    },
    icon: {
      type: String,
    },
    acronym: {
      type: String,
      trim: true,
      unique: true,
    },
    host: {
      type: Schema.ObjectId,
      ref: "User",
    },
    author: {
      type: Schema.ObjectId,
      ref: "User",
    },
    sprintlength: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: PROJECT_STATUS,
      default: "upcoming",
    },
    members: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    deleteFlag: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

projectSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "author host members",
    options: { _recursed: true },
  });
  next();
});

projectSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      icon: this.icon,
      status: this.status,
      members: this.members.map((member) => member.view()),
      created_at: this.created_at,
      updated_at: this.updated_at,
    };

    return full
      ? {
          ...view,
          acronym: this.acronym,
          sprintlength: this.sprintlength,
          host: this.host.view(),
          description: this.description,
          author: this.author.view(),
        }
      : view;
  },
};

projectSchema.plugin(mongooseKeywords, {
  paths: ["name", "acronym"],
});
const model = mongoose.model("Project", projectSchema);

export const schema = model.schema;
export default model;
