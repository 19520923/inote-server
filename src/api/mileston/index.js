import { Router } from "express";
import { middleware as query, Schema } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, update, destroy } from "./controller";
import { schema } from "./model";
export Mileston, { schema } from "./model";

const router = new Router();
const { title, project, deleteFlag } = schema.tree;
const schema_q = new Schema({
  project: {
    type: String,
    required: true,
  },
});

/**
 * @api {post} /milestons Create mileston
 * @apiName CreateMileston
 * @apiGroup Mileston
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Mileston's title.
 * @apiParam project Mileston's project.
 * @apiParam deleteFlag Mileston's deleteFlag.
 * @apiSuccess {Object} mileston Mileston's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Mileston not found.
 * @apiError 401 user access only.
 */
router.post(
  "/",
  token({ required: true }),
  body({ title, project, deleteFlag }),
  create
);

/**
 * @api {get} /milestons Retrieve milestons
 * @apiName RetrieveMilestons
 * @apiGroup Mileston
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of milestons.
 * @apiSuccess {Object[]} rows List of milestons.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(schema_q), index);

/**
 * @api {put} /milestons/:id Update mileston
 * @apiName UpdateMileston
 * @apiGroup Mileston
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Mileston's title.
 * @apiParam project Mileston's project.
 * @apiParam deleteFlag Mileston's deleteFlag.
 * @apiSuccess {Object} mileston Mileston's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Mileston not found.
 * @apiError 401 user access only.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({ title, deleteFlag }),
  update
);

/**
 * @api {delete} /milestons/:id Delete mileston
 * @apiName DeleteMileston
 * @apiGroup Mileston
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Mileston not found.
 * @apiError 401 user access only.
 */
router.delete("/:id", token({ required: true }), destroy);

export default router;
