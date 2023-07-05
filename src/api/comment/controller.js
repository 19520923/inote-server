import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Comment } from ".";
import { Notification } from "../notification";
import _ from "lodash";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Comment.create({ ...body, author: user })
    .then(async (comment) => {
      if (!comment) return null;
      if (comment.to && comment.to.length) {
        comment.to.forEach(async (t) => {
          await Notification.create({
            content: `${user.fullname} mention you in comment "${comment.content}"`,
            author: user,
            type: "task",
            receiver: t,
            project: comment.project,
          });
        });
      }

      if (comment.reply_to) {
        await Notification.create({
          content: `${user.fullname} mention you in comment "${comment.content}"`,
          author: user,
          type: "task",
          receiver: comment.reply_to.author,
          project: comment.project,
        });
      }
      return comment;
    })
    .then((comment) => comment.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Comment.count({ ...query, deleted_flag: false })
    .then((count) =>
      Comment.find({ ...query, deleted_flag: false }, select, cursor).then(
        (comments) => ({
          count,
          rows: comments.map((comment) => comment.view(true)),
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
    .then((comment) => (comment ? comment.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Comment.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((comment) => (comment ? comment.remove() : null))
    .then(success(res, 204))
    .catch(next);
