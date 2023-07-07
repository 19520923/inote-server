import mongoose, { Schema } from "mongoose";
import mongooseKeywords from "mongoose-keywords";
import { PROJECT_STATUS } from "../../constants";
import { botId } from "../../config";
import socket from "../../services/socket";
import _ from "lodash";

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
    deleted_flag: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    hosts: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    wikis: [
      {
        id: String,
        title: String,
        content: String,
      },
    ],
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
    path: "author hosts members",
    options: { _recursed: true },
  });
  next();
});

projectSchema.post(/^save/, async function (child) {
  try {
    const socket_ids = _.filter(
      [...(child.hosts || []), ...(child.members || [])],
      (e) => e !== child.author || e !== botId
    ).map((e) => String(e));
    if (!child.populated("author hosts members")) {
      await child
        .populate({
          path: "author hosts members",
          options: { _recursed: true },
        })
        .execPopulate();
    }
    socket.to("project:update", socket_ids, child.view());
  } catch (err) {
    console.log(err);
  }
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
      hosts: this.hosts.map((host) => host.view()),
      created_at: this.created_at,
      updated_at: this.updated_at,
      author: this.author.view(),
    };

    return full
      ? {
          ...view,
          acronym: this.acronym,
          sprintlength: this.sprintlength,
          description: this.description,
          wikis: this.wikis,
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
