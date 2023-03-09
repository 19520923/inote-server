import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, update, destroy } from "./controller";
import { schema } from "./model";
export Job, { schema } from "./model";

const router = new Router();
const { name, deleteFlag } = schema.tree;

/**
 * @api {post} /jobs Create job
 * @apiName CreateJob
 * @apiGroup Job
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name deleteFlag Job's name deleteFlag.
 * @apiSuccess {Object} job Job's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Job not found.
 * @apiError 401 user access only.
 */
router.post("/", token({ required: true }), body({ name }), create);

/**
 * @api {get} /jobs Retrieve jobs
 * @apiName RetrieveJobs
 * @apiGroup Job
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of jobs.
 * @apiSuccess {Object[]} rows List of jobs.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(), index);

/**
 * @api {put} /jobs/:id Update job
 * @apiName UpdateJob
 * @apiGroup Job
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name deleteFlag Job's name deleteFlag.
 * @apiSuccess {Object} job Job's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Job not found.
 * @apiError 401 user access only.
 */
router.put(
  "/:id",
  token({ required: true, roles: ["admin"] }),
  body({ name, deleteFlag }),
  update
);

/**
 * @api {delete} /jobs/:id Delete job
 * @apiName DeleteJob
 * @apiGroup Job
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Job not found.
 * @apiError 401 user access only.
 */
router.delete("/:id", token({ required: true, roles: ["admin"] }), destroy);

export default router;
