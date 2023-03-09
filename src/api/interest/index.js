import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { create, index, update, destroy } from "./controller";
import { schema } from "./model";
import { token } from "../../services/passport";
export Interest, { schema } from "./model";

const router = new Router();
const { name, deleteFlag } = schema.tree;

/**
 * @api {post} /interests Create interest
 * @apiName CreateInterest
 * @apiGroup Interest
 * @apiParam name Interest's name.
 * @apiParam deleteFlag Interest's deleteFlag.
 * @apiSuccess {Object} interest Interest's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Interest not found.
 */
router.post("/", token({ required: true }), body({ name }), create);

/**
 * @api {get} /interests Retrieve interests
 * @apiName RetrieveInterests
 * @apiGroup Interest
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of interests.
 * @apiSuccess {Object[]} rows List of interests.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/", token({ required: true }), query(), index);

/**
 * @api {put} /interests/:id Update interest
 * @apiName UpdateInterest
 * @apiGroup Interest
 * @apiParam name Interest's name.
 * @apiParam deleteFlag Interest's deleteFlag.
 * @apiSuccess {Object} interest Interest's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Interest not found.
 */
router.put(
  "/:id",
  token({ required: true, roles: ["admin"] }),
  body({ name, deleteFlag }),
  update
);

/**
 * @api {delete} /interests/:id Delete interest
 * @apiName DeleteInterest
 * @apiGroup Interest
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Interest not found.
 */
router.delete("/:id", token({ required: true, roles: ["admin"] }), destroy);

export default router;
