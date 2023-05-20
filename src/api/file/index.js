import { Router } from "express";
import { middleware as query, Schema } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, update } from "./controller";
import { schema, files_schema } from "./model";
export File, { schema } from "./model";

const router = new Router();
const { name, url, size } = schema.tree;
const { files } = files_schema.tree;

const schema_q = new Schema({
  project: {
    type: String,
    required: true,
  },
});
/**
 * @api {post} /files Create file
 * @apiName CreateFile
 * @apiGroup File
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name File's name.
 * @apiParam url File's url.
 * @apiParam size File's size.
 * @apiSuccess {Object} file File's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 File not found.
 * @apiError 401 user access only.
 */
router.post("/", token({ required: true }), body({ files }), create);

/**
 * @api {get} /files Retrieve files
 * @apiName RetrieveFiles
 * @apiGroup File
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of files.
 * @apiSuccess {Object[]} rows List of files.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(schema_q), index);

/**
 * @api {put} /files/:id Update file
 * @apiName UpdateFile
 * @apiGroup File
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name File's name.
 * @apiParam url File's url.
 * @apiParam size File's size.
 * @apiSuccess {Object} file File's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 File not found.
 * @apiError 401 user access only.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({ name, url, size }),
  update
);

export default router;
