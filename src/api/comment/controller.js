import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Comment } from ".";
import _ from "lodash";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Comment.create({ ...body, author: user })
    .then((comment) => comment.view())
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Comment.count({ ...query, deleted_flag: false })
    .then((count) =>
      Comment.find({ ...query, deleted_flag: false }, select, cursor).then(
        (comments) => ({
          count,
          rows: comments.map((comment) => comment.view()),
        })
      )
    )
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Comment.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((comment) =>
      comment ? Object.assign(comment, _.omitBy(body, _.isNil)).save() : null
    )
    .then((comment) => (comment ? comment.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Comment.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((comment) => (comment ? comment.remove() : null))
    .then(success(res, 204))
    .catch(next);
