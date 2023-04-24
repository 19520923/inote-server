import { Router } from "express";
import { middleware as query, Schema } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, show, update, destroy, sync } from "./controller";
import { schema, sync_schema } from "./model";
export Note, { schema } from "./model";

const router = new Router();
const {
  title,
  icon,
  content,
  category,
  opened_at,
  starred,
  deleted_flag,
  created_at,
  updated_at,
  type,
} = schema.tree;

const schema_q = new Schema({
  category: String,
});

const { notes } = sync_schema.tree;
/**
 * @api {post} /notes Create note
 * @apiName CreateNote
 * @apiGroup Note
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Note's title.
 * @apiParam icon Note's icon.
 * @apiParam content Note's content.
 * @apiParam category Note's category.
 * @apiParam opened_at Note's opened_at.
 * @apiParam starred Note's starred.
 * @apiParam deleted_flag Note's deleted_flag.
 * @apiSuccess {Object} note Note's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Note not found.
 * @apiError 401 user access only.
 */
router.post(
  "/",
  token({ required: true }),
  body({ title, icon, content, category, type }),
  create
);

/**
 * @api {get} /notes Retrieve notes
 * @apiName RetrieveNotes
 * @apiGroup Note
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of notes.
 * @apiSuccess {Object[]} rows List of notes.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(schema_q), index);

/**
 * @api {get} /notes/:id Retrieve note
 * @apiName RetrieveNote
 * @apiGroup Note
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} note Note's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Note not found.
 * @apiError 401 user access only.
 */
router.get("/:id", token({ required: true }), show);

/**
 * @api {put} /notes/:id Update note
 * @apiName UpdateNote
 * @apiGroup Note
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Note's title.
 * @apiParam icon Note's icon.
 * @apiParam content Note's content.
 * @apiParam category Note's category.
 * @apiParam opened_at Note's opened_at.
 * @apiParam starred Note's starred.
 * @apiParam deleted_flag Note's deleted_flag.
 * @apiSuccess {Object} note Note's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Note not found.
 * @apiError 401 user access only.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({
    title,
    icon,
    content,
    category,
    opened_at,
    starred,
    deleted_flag,
  }),
  update
);

/**
 * @api {delete} /notes/:id Delete note
 * @apiName DeleteNote
 * @apiGroup Note
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Note not found.
 * @apiError 401 user access only.
 */
router.delete("/:id", token({ required: true }), destroy);

router.post("/sync", token({ required: true }), body({ notes }), sync);

export default router;
