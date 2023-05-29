import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, update, destroy } from './controller'
import { schema } from './model'
export Activity, { schema } from './model'

const router = new Router()
const { name, order, deleted_flag, project } = schema.tree
const schema_q = new Schema({
  project: {
    type: String,
    required: true,
  },
});

/**
 * @api {post} /activities Create activity
 * @apiName CreateActivity
 * @apiGroup Activity
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Activity's name.
 * @apiParam order Activity's order.
 * @apiParam delete_flag Activity's delete_flag.
 * @apiSuccess {Object} activity Activity's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Activity not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ name, order, project }),
  create)

/**
 * @api {get} /activities Retrieve activities
 * @apiName RetrieveActivities
 * @apiGroup Activity
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of activities.
 * @apiSuccess {Object[]} rows List of activities.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(schema_q),
  index)

/**
 * @api {put} /activities/:id Update activity
 * @apiName UpdateActivity
 * @apiGroup Activity
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Activity's name.
 * @apiParam order Activity's order.
 * @apiParam delete_flag Activity's delete_flag.
 * @apiSuccess {Object} activity Activity's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Activity not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ name, order, deleted_flag }),
  update)

/**
 * @api {delete} /activities/:id Delete activity
 * @apiName DeleteActivity
 * @apiGroup Activity
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Activity not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
