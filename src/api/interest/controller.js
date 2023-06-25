import { success, notFound } from "../../services/response/";
import { Interest } from ".";
import { User } from "../user";
import { AssigneeRecommendation } from "../assignee_recommendation";

export const create = ({ bodymen: { body } }, res, next) =>
  Interest.create(body)
    .then(async (interest) => {
      const users = await User.find({});
      users.forEach(async (user) => {
        await AssigneeRecommendation.create({
          user: user,
          tag: interest,
          avg_point: 0,
        });
      });
      return interest;
    })
    .then((interest) => interest.view())
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Interest.count({ ...query, deleted_flag: false })
    .then((count) =>
      Interest.find({ ...query, deleted_flag: false }, select, cursor).then(
        (interests) => ({
          count,
          rows: interests.map((interest) => interest.view()),
        })
      )
    )
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) =>
  Interest.findById(params.id)
    .then(notFound(res))
    .then((interest) =>
      interest ? Object.assign(interest, body).save() : null
    )
    .then((interest) => (interest ? interest.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Interest.findById(params.id)
    .then(notFound(res))
    .then((interest) => (interest ? interest.remove() : null))
    .then(success(res, 204))
    .catch(next);
