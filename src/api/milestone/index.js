import { Router } from "express";
import { middleware as query, Schema } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, update, destroy } from "./controller";
import { schema } from "./model";
export Milestone, { schema } from "./model";

const router = new Router();
const { title, project, deleted_flag } = schema.tree;

const schema_q = new Schema({
  project: {
    type: String,
    required: true,
  },
});

/**
 * @api {post} /milestones Create milestone
 * @apiName CreateMilestone
 * @apiGroup Milestone
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Milestone's title.
 * @apiParam project Milestone's project.
 * @apiParam deleted_flag Milestone's deleted_flag.
 * @apiSuccess {Object} milestone Milestone's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Milestone not found.
 * @apiError 401 user access only.
 */
router.post(
  "/",
  token({ required: true }),
  body({ title, project, deleted_flag }),
  create
);

/**
 * @api {get} /milestones Retrieve milestones
 * @apiName RetrieveMilestones
 * @apiGroup Milestone
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of milestones.
 * @apiSuccess {Object[]} rows List of milestones.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(schema_q), index);

/**
 * @api {put} /milestones/:id Update milestone
 * @apiName UpdateMilestone
 * @apiGroup Milestone
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Milestone's title.
 * @apiParam project Milestone's project.
 * @apiParam deleted_flag Milestone's deleted_flag.
 * @apiSuccess {Object} milestone Milestone's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Milestone not found.
 * @apiError 401 user access only.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({ title, deleted_flag }),
  update
);

/**
 * @api {delete} /milestones/:id Delete milestone
 * @apiName DeleteMilestone
 * @apiGroup Milestone
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Milestone not found.
 * @apiError 401 user access only.
 */
router.delete("/:id", token({ required: true }), destroy);

export default router;
