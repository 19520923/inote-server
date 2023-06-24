import { Router } from "express";
import { middleware as query, Schema } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, show, update, destroy, report } from "./controller";
import { schema } from "./model";
export Task, { schema } from "./model";

const router = new Router();
const {
  project,
  parent,
  content,
  subject,
  assignee,
  status,
  priority,
  milestone,
  estimate,
  actual,
  start_date,
  due_date,
  end_date,
  opened_at,
  deleted_flag,
  is_remind,
  activity,
  topics
} = schema.tree;

const schema_q = new Schema({
  project: String,
  assignee: String,
  priority: String,
  assignee: String,
  registered_by: String,
  is_remind: Boolean,
  status: String,
  milestone: String,
  activity: String,
  after: {
    type: Date,
    paths: ["due_date"],
    operator: "$gte",
  },
  before: {
    type: Date,
    paths: ["due_date"],
    operator: "$lte",
  },
});

const report_schema = new Schema({
  project: {
    type: String,
    required: true,
  },
  // assignee: String,
  before: {
    type: Date,
    paths: ["created_at"],
    operator: "$lte",
  },
});
/**
 * @api {post} /tasks Create task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam project Task's project.
 * @apiParam parent Task's parent.
 * @apiParam code Task's code.
 * @apiParam description Task's description.
 * @apiParam subject Task's subject.
 * @apiParam assignee Task's assignee.
 * @apiParam status Task's status.
 * @apiParam priorty Task's priorty.
 * @apiParam milestone Task's milestone.
 * @apiParam estimate Task's estimate.
 * @apiParam actual Task's actual.
 * @apiParam startDate Task's startDate.
 * @apiParam dueDate Task's dueDate.
 * @apiParam endDate Task's endDate.
 * @apiParam opened_at Task's opened_at.
 * @apiParam deleted_flag Task's deleted_flag.
 * @apiParam reminderFlag Task's reminderFlag.
 * @apiSuccess {Object} task Task's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Task not found.
 * @apiError 401 user access only.
 */
router.post(
  "/",
  token({ required: true }),
  body({
    project,
    parent,
    content,
    subject,
    assignee,
    status,
    priority,
    milestone,
    estimate,
    actual,
    start_date,
    due_date,
    end_date,
    is_remind,
    activity,
    topics,
  }),
  create
);

/**
 * @api {get} /tasks Retrieve tasks
 * @apiName RetrieveTasks
 * @apiGroup Task
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of tasks.
 * @apiSuccess {Object[]} rows List of tasks.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(schema_q), index);

/**
 * @api {get} /tasks/:id Retrieve task
 * @apiName RetrieveTask
 * @apiGroup Task
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} task Task's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Task not found.
 * @apiError 401 user access only.
 */
router.get("/:id", token({ required: true }), show);

/**
 * @api {put} /tasks/:id Update task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam project Task's project.
 * @apiParam parent Task's parent.
 * @apiParam code Task's code.
 * @apiParam description Task's description.
 * @apiParam subject Task's subject.
 * @apiParam assignee Task's assignee.
 * @apiParam status Task's status.
 * @apiParam priorty Task's priorty.
 * @apiParam milestone Task's milestone.
 * @apiParam estimate Task's estimate.
 * @apiParam actual Task's actual.
 * @apiParam startDate Task's startDate.
 * @apiParam dueDate Task's dueDate.
 * @apiParam endDate Task's endDate.
 * @apiParam opened_at Task's opened_at.
 * @apiParam deleted_flag Task's deleted_flag.
 * @apiParam reminderFlag Task's reminderFlag.
 * @apiSuccess {Object} task Task's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Task not found.
 * @apiError 401 user access only.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({
    parent,
    content,
    subject,
    assignee,
    status,
    priority,
    milestone,
    estimate,
    actual,
    start_date,
    due_date,
    end_date,
    opened_at,
    deleted_flag,
    is_remind,
    activity,
    topics,
  }),
  update
);

/**
 * @api {delete} /tasks/:id Delete task
 * @apiName DeleteTask
 * @apiGroup Task
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Task not found.
 * @apiError 401 user access only.
 */
router.delete("/:id", token({ required: true }), destroy);

router.get(
  "/report/overview",
  token({ required: true }),
  query(report_schema),
  report
);

export default router;
