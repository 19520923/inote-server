import { success, notFound } from "../../services/response/";
import { Milestone } from ".";
import _ from "lodash";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Milestone.create({ ...body, author: user })
    .then((milestone) => milestone.view())
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Milestone.count({ ...query, deleted_flag: false })
    .then((count) =>
      Milestone.find({ ...query, deleted_flag: false }, select, cursor).then(
        (milestones) => ({
          count,
          rows: milestones.map((milestone) => milestone.view()),
        })
      )
    )
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Milestone.findById(params.id)
    .then(notFound(res))
    .then((milestone) =>
      milestone
        ? Object.assign(milestone, _.omitBy(body, _.isNil)).save()
        : null
    )
    .then((milestone) => (milestone ? milestone.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Milestone.findById(params.id)
    .then(notFound(res))
    .then((milestone) => (milestone ? milestone.remove() : null))
    .then(success(res, 204))
    .catch(next);
