import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, show, update, destroy } from "./controller";
import { schema } from "./model";
export Project, { schema } from "./model";

const router = new Router();
const {
  name,
  icon,
  acronym,
  hosts,
  author,
  sprintlength,
  status,
  members,
  deleteFlag,
} = schema.tree;

/**
 * @api {post} /projects Create project
 * @apiName CreateProject
 * @apiGroup Project
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Project's name.
 * @apiParam icon Project's icon.
 * @apiParam acronym Project's acronym.
 * @apiParam host Project's host.
 * @apiParam author Project's author.
 * @apiParam sprintlength Project's sprintlength.
 * @apiParam status Project's status.
 * @apiParam members Project's members.
 * @apiParam deleteFlag Project's deleteFlag.
 * @apiSuccess {Object} project Project's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Project not found.
 * @apiError 401 user access only.
 */
router.post(
  "/",
  token({ required: true }),
  body({
    name,
    icon,
    acronym,
    hosts,
    members,
  }),
  create
);

/**
 * @api {get} /projects Retrieve projects
 * @apiName RetrieveProjects
 * @apiGroup Project
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of projects.
 * @apiSuccess {Object[]} rows List of projects.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(), index);

/**
 * @api {get} /projects/:id Retrieve project
 * @apiName RetrieveProject
 * @apiGroup Project
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} project Project's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Project not found.
 * @apiError 401 user access only.
 */
router.get("/:id", token({ required: true }), show);

/**
 * @api {put} /projects/:id Update project
 * @apiName UpdateProject
 * @apiGroup Project
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Project's name.
 * @apiParam icon Project's icon.
 * @apiParam acronym Project's acronym.
 * @apiParam host Project's host.
 * @apiParam author Project's author.
 * @apiParam sprintlength Project's sprintlength.
 * @apiParam status Project's status.
 * @apiParam members Project's members.
 * @apiParam deleteFlag Project's deleteFlag.
 * @apiSuccess {Object} project Project's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Project not found.
 * @apiError 401 user access only.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({
    name,
    icon,
    acronym,
    hosts,
    author,
    sprintlength,
    status,
    members,
    deleteFlag,
  }),
  update
);

/**
 * @api {delete} /projects/:id Delete project
 * @apiName DeleteProject
 * @apiGroup Project
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Project not found.
 * @apiError 401 user access only.
 */
router.delete("/:id", token({ required: true }), destroy);

export default router;
