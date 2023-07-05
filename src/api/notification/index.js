import { Router } from "express";
import { middleware as query, Schema } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, update } from "./controller";
import { schema } from "./model";
export Notification, { schema } from "./model";

const router = new Router();
const { content, type, receiver, is_seen } = schema.tree;
const q_shema = new Schema({
  type: String,
  project: String,
});

/**
 * @api {post} /notifications Create notification
 * @apiName CreateNotification
 * @apiGroup Notification
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam content Notification's content.
 * @apiParam isSeen Notification's isSeen.
 * @apiParam type Notification's type.
 * @apiParam isSystem Notification's isSystem.
 * @apiParam author Notification's author.
 * @apiParam receiver Notification's receiver.
 * @apiParam deleted_flag Notification's deleted_flag.
 * @apiSuccess {Object} notification Notification's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Notification not found.
 * @apiError 401 admin access only.
 */
router.post(
  "/",
  token({ required: true }),
  body({ content, type, receiver }),
  create
);

/**
 * @api {get} /notifications Retrieve notifications
 * @apiName RetrieveNotifications
 * @apiGroup Notification
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of notifications.
 * @apiSuccess {Object[]} rows List of notifications.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get("/", token({ required: true }), query(q_shema), index);

/* Updating the notification. */
router.put("/:id", token({ required: true }), body({ is_seen }), update);

export default router;
