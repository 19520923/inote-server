import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Activity } from ".";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Activity.create({ ...body, author: user })
    .then((activity) => activity.view())
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Activity.count({ ...query, delete_flag: true })
    .then((count) =>
      Activity.find({ ...query, delete_flag: true }, select, cursor)
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
    .populate("author")
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((activity) =>
      activity ? Object.assign(activity, body).save() : null
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