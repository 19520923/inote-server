import mongoose, { Schema } from "mongoose";
import { calculateSuitablePoint } from "../../utils/user_recommendation";
import { Interest } from "../interest";
import { AvgTaskReview } from "../avgTaskReview";
import { AssigneeRecommendation } from "../assignee_recommendation";
import _ from "lodash";

const taskReviewSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.ObjectId,
      ref: "Project",
    },
    task: {
      type: Schema.ObjectId,
      ref: "Task",
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
    },
    text: String,
    point: {
      type: Number,
      max: 10,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
taskReviewSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: "task author",
  });
  next();
});

taskReviewSchema.post(/^save/, async function (child) {
  try {
    if (!child.populated("author task")) {
      await child
        .populate({
          path: "author task",
        })
        .execPopulate();
    }
    if (child.point) {
      const taskReviews = await this.model("TaskReview").find({
        task: child.task,
        user: child.user,
        point: { $ne: null },
      });
      const avg_point = _.sumBy(
        taskReviews,
        (t) => t.point / taskReviews.length
      );
      await AvgTaskReview.findOneAndUpdate(
        {
          task: child.task,
          user: child.user,
        },
        { avg_point: avg_point }
      ).then(async () => {
        const taskReviews = await AvgTaskReview.find({
          user: child.user,
        }).populate({ path: "task" });
        const tags = await Interest.find({});
        const weightPoints = calculateSuitablePoint(taskReviews, tags);
        tags.forEach(async (tag, index) => {
          await AssigneeRecommendation.findOneAndUpdate(
            { user: child.user, tag: tag._id },
            { avg_point: weightPoints[index] }
          );
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
});

taskReviewSchema.methods = {
  view() {
    return {
      // simple view
      id: this.id,
      author: this.author.view(),
      project: this.project,
      task: this.task && this.task.view(true),
      point: this.point,
      text: this.text,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  },
};

const model = mongoose.model("TaskReview", taskReviewSchema);

export const schema = model.schema;
export default model;
