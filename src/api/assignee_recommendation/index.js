import { Router } from "express";
import { middleware as query, Schema } from "querymen";
import { token } from "../../services/passport";
import { index } from "./controller";
export AssigneeRecommendation, { schema } from "./model";

const router = new Router();
const schema = new Schema({
  tags: [{ type: String, required: true }],
  project: { type: String, required: true },
});
/**
 * @api {get} /assignee_recommendations Retrieve assignee recommendations
 * @apiName RetrieveAssigneeRecommendations
 * @apiGroup AssigneeRecommendation
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of assignee recommendations.
 * @apiSuccess {Object[]} rows List of assignee recommendations.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get("/", token({ required: true }), query(schema), index);

export default router;
