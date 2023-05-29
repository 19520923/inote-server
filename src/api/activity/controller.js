import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Activity } from ".";
import _ from "lodash";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Activity.create({ ...body, author: user })
    .then((activity) => activity.view())
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Activity.count({ ...query, deleted_flag: false })
    .then((count) =>
      Activity.find({ ...query, deleted_flag: false }, select, cursor)
        .populate("author")
        .then((activities) => ({
          count,
          rows: activities.map((activity) => activity.view()),
        }))
    )
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Activity.findById(params.id)
    .then(notFound(res))
    .then((activity) =>
      activity ? Object.assign(activity, _.omitBy(body, _.isNil)).save() : null
    )
    .then((activity) => (activity ? activity.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Activity.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((activity) => (activity ? activity.remove() : null))
    .then(success(res, 204))
    .catch(next);
