import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
    },
    url: {
      type: String,
    },
    size: {
      type: Number,
    },
    project: {
      type: Schema.ObjectId,
      ref: "Project",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const filesSchema = new Schema({
  files: [fileSchema],
});

fileSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "author",
    options: { _recursed: true },
  });
  next();
});

fileSchema.post(/^save/, async function (child) {
  try {
    if (!child.populated("author")) {
      await child
        .populate({
          path: "author",
          options: { _recursed: true },
        })
        .execPopulate();
    }
  } catch (err) {
    console.log(err);
  }
});

fileSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      author: this.author.view(),
      name: this.name,
      url: this.url,
      size: this.size,
      created_at: this.created_at,
      updated_at: this.updated_at,
      project: this.project,
    };
  },
};

const model = mongoose.model("File", fileSchema);
const filesModel = mongoose.model("Files", filesSchema);

export const schema = model.schema;
export const files_schema = filesModel.schema;

export default model;
