import { Router } from "express";
import { middleware as query, Schema } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, update, destroy } from "./controller";
import { schema } from "./model";
export TaskReview, { schema } from "./model";

const router = new Router();
const q_schema = new Schema({
  project: String,
  author: String,
  user: String,
  task: { type: String, paths: ["task.id"] },
});

const { point, text } = schema.tree;

/**
 * @api {post} /task_reviews Create task review
 * @apiName CreateTaskReview
 * @apiGroup TaskReview
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam project task point text Task review's project task point text.
 * @apiSuccess {Object} taskReview Task review's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Task review not found.
 * @apiError 401 user access only.
 */
router.post("/", token({ required: true }), body({ point, text }), create);

/**
 * @api {get} /task_reviews Retrieve task reviews
 * @apiName RetrieveTaskReviews
 * @apiGroup TaskReview
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of task reviews.
 * @apiSuccess {Object[]} rows List of task reviews.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(q_schema), index);

/**
 * @api {put} /task_reviews/:id Update task review
 * @apiName UpdateTaskReview
 * @apiGroup TaskReview
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam project task point text Task review's project task point text.
 * @apiSuccess {Object} taskReview Task review's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Task review not found.
 * @apiError 401 user access only.
 */
router.put("/:id", token({ required: true }), body({ point, text }), update);

/**
 * @api {delete} /task_reviews/:id Delete task review
 * @apiName DeleteTaskReview
 * @apiGroup TaskReview
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Task review not found.
 * @apiError 401 user access only.
 */
router.delete("/:id", token({ required: true }), destroy);

export default router;
