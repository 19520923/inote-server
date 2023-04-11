import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, update, destroy } from "./controller";
import { schema } from "./model";
export Reminder, { schema } from "./model";

const router = new Router();
const { title, content, time, is_done, is_remind, deleted_flag } = schema.tree;

/**
 * @api {post} /reminders Create reminder
 * @apiName CreateReminder
 * @apiGroup Reminder
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Reminder's title.
 * @apiParam content Reminder's content.
 * @apiParam time Reminder's time.
 * @apiParam is_done Reminder's is_done.
 * @apiParam is_remind Reminder's is_remind.
 * @apiParam deleted_flag Reminder's deleted_flag.
 * @apiSuccess {Object} reminder Reminder's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Reminder not found.
 * @apiError 401 user access only.
 */
router.post(
  "/",
  token({ required: true }),
  body({ title, content, time, is_done, is_remind, deleted_flag }),
  create
);

/**
 * @api {get} /reminders Retrieve reminders
 * @apiName RetrieveReminders
 * @apiGroup Reminder
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of reminders.
 * @apiSuccess {Object[]} rows List of reminders.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(), index);

/**
 * @api {put} /reminders/:id Update reminder
 * @apiName UpdateReminder
 * @apiGroup Reminder
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Reminder's title.
 * @apiParam content Reminder's content.
 * @apiParam time Reminder's time.
 * @apiParam is_done Reminder's is_done.
 * @apiParam is_remind Reminder's is_remind.
 * @apiParam deleted_flag Reminder's deleted_flag.
 * @apiSuccess {Object} reminder Reminder's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Reminder not found.
 * @apiError 401 user access only.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({ title, content, time, is_done, is_remind, deleted_flag }),
  update
);

/**
 * @api {delete} /reminders/:id Delete reminder
 * @apiName DeleteReminder
 * @apiGroup Reminder
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Reminder not found.
 * @apiError 401 user access only.
 */
router.delete("/:id", token({ required: true }), destroy);

export default router;
