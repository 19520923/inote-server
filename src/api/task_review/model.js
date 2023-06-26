import mongoose, { Schema } from "mongoose";
import { calculateSuitablePoint } from "../../utils/user_recommendation";
import { Interest } from "../interest";
import { AvgTaskReview } from "../avgTaskReview";
import { AssigneeRecommendation } from "../assignee_recommendation";
import _ from "lodash";
import { TASK_PRIORITY, TASK_STATUS } from "../../constants";

const taskSchema = Schema({
  id: String,
  project: {
    type: Schema.ObjectId,
    ref: "Project",
  },
  key: {
    type: String,
  },
  content: {
    type: String,
  },
  subject: {
    type: String,
  },
  registered_by: {
    id: String,
    avatar: String,
    fullname: String,
    username: String,
  },
  assignee: {
    id: String,
    avatar: String,
    fullname: String,
    username: String,
  },
  status: {
    type: String,
    enum: TASK_STATUS,
    default: TASK_STATUS[0],
  },
  priority: {
    type: String,
    enum: TASK_PRIORITY,
    default: TASK_PRIORITY[0],
  },
  milestone: {
    id: String,
    name: String,
  },
  estimate: {
    type: Number,
    min: 0,
  },
  actual: {
    type: Number,
    min: 0,
  },
  start_date: {
    type: Date,
  },
  due_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  opened_at: {
    type: Date,
  },
  deleted_flag: {
    type: Boolean,
  },
  is_remind: {
    type: Boolean,
  },
  activity: {
    id: String,
    name: String,
  },
  topics: [
    new Schema({
      id: String,
      name: String,
    }),
  ],
});

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
    task: taskSchema,
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
    path: "author",
  });
  next();
});

taskReviewSchema.post(/^save/, async function (child) {
  try {
    if (!child.populated("author")) {
      await child
        .populate({
          path: "author",
        })
        .execPopulate();
    }
    if (child.point) {
      const userTaskReviews = await this.model("TaskReview").find({
        "task.id": child.task.id,
        user: child.user,
        point: { $ne: 0 },
      });
      const avg_point = _.sumBy(
        userTaskReviews,
        (t) => t.point / (userTaskReviews.length || 1)
      );
      await AvgTaskReview.findOneAndUpdate(
        {
          task: child.task.id,
          user: child.user,
        },
        { avg_point: avg_point }
      )
      .then(async () => {
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
      user: this.user,
      task: this.task,
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
