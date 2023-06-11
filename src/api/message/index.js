import { Router } from "express";
import { middleware as query, Schema } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, update, destroy } from "./controller";
import { schema } from "./model";
export Message, { schema } from "./model";

const router = new Router();
const { project, reply_to, content, deleted_flag, images, to, is_pinned, is_edited } = schema.tree;

const schema_q = new Schema({
  project: {
    type: String,
    required: true,
  },
  is_pinned: Boolean,
});

/**
 * @api {post} /messages Create message
 * @apiName CreateMessage
 * @apiGroup Message
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam project Message's project.
 * @apiParam reply_to Message's reply_to.
 * @apiParam content Message's content.
 * @apiParam deleted_flag Message's deleted_flag.
 * @apiParam type Message's type.
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 * @apiError 401 user access only.
 */
router.post(
  "/",
  token({ required: true }),
  body({ project, reply_to, content, images, to }),
  create
);

/**
 * @api {get} /messages Retrieve messages
 * @apiName RetrieveMessages
 * @apiGroup Message
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of messages.
 * @apiSuccess {Object[]} rows List of messages.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(schema_q), index);

/**
 * @api {put} /messages/:id Update message
 * @apiName UpdateMessage
 * @apiGroup Message
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam project Message's project.
 * @apiParam reply_to Message's reply_to.
 * @apiParam content Message's content.
 * @apiParam deleted_flag Message's deleted_flag.
 * @apiParam type Message's type.
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 * @apiError 401 user access only.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({ reply_to, content, deleted_flag, to, is_pinned, is_edited }),
  update
);

/**
 * @api {delete} /messages/:id Delete message
 * @apiName DeleteMessage
 * @apiGroup Message
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Message not found.
 * @apiError 401 user access only.
 */
router.delete("/:id", token({ required: true }), destroy);

export default router;
