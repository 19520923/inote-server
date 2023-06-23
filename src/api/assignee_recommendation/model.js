import mongoose, { Schema } from 'mongoose'

const assigneeRecommendationSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "User",
    },
    avg_point: {
      type: Number,
    },
    tag: {
      type: Schema.ObjectId,
      ref: "Interest",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

assigneeRecommendationSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "tag user",
  });
  next();
});

assigneeRecommendationSchema.post(/^save/, async function (child) {
  try {
    if (!child.populated("tag user")) {
      await child
        .populate({
          path: "tag user",
        })
        .execPopulate();
    }
  } catch (err) {
    console.log(err);
  }
});

assigneeRecommendationSchema.methods = {
  view () {
    return {
      // simple view
      id: this.id,
      user: this.user.view(),
      avg_point: this.avg_point,
      tag: this.tag && this.tag.name,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }
}

const model = mongoose.model('AssigneeRecommendation', assigneeRecommendationSchema)

export const schema = model.schema
export default model
