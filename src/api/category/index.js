import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { create, index, update, destroy, sync } from "./controller";
import { schema, sync_schema } from "./model";
import { token } from "../../services/passport";
export Category, { schema } from "./model";

const router = new Router();
const { name, is_hide, order, updated_at, deleted_flag, created_at } =
  schema.tree;
const { categories } = sync_schema.tree;

/**
 * @api {post} /categories Create category
 * @apiName CreateCategory
 * @apiGroup Category
 * @apiParam name Category's name.
 * @apiParam isHide Category's isHide.
 * @apiParam deleted_flag Category's deleted_flag.
 * @apiParam order Category's order.
 * @apiSuccess {Object} category Category's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Category not found.
 */
router.post(
  "/",
  token({ required: true }),
  body({ name, order, created_at, updated_at }),
  create
);

/**
 * @api {get} /categories Retrieve categories
 * @apiName RetrieveCategories
 * @apiGroup Category
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of categories.
 * @apiSuccess {Object[]} rows List of categories.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/", token({ required: true }), query(), index);

/**
 * @api {put} /categories/:id Update category
 * @apiName UpdateCategory
 * @apiGroup Category
 * @apiParam name Category's name.
 * @apiParam isHide Category's isHide.
 * @apiParam deleted_flag Category's deleted_flag.
 * @apiParam order Category's order.
 * @apiSuccess {Object} category Category's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Category not found.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({ name, is_hide, order, deleted_flag, updated_at }),
  update
);

/**
 * @api {delete} /categories/:id Delete category
 * @apiName DeleteCategory
 * @apiGroup Category
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Category not found.
 */
router.delete("/:id", token({ required: true }), destroy);
router.post("/sync", token({ required: true }), body({ categories }), sync);

export default router;
