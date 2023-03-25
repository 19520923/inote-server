import { success, notFound } from "../../services/response/";
import { Notification } from ".";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Notification.create({ ...body, author: user })
    .then((notification) => notification.view())
    .then(success(res, 201))
    .catch(next);

export const index = (
  { user, querymen: { query, select, cursor } },
  res,
  next
) =>
  Notification.count({ ...query, receiver: user })
    .then((count) =>
      Notification.find({ ...query, receiver: user }, select, cursor).then(
        (notifications) => ({
          count,
          rows: notifications.map((notification) => notification.view()),
        })
      )
    )
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Notification.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((noti) => (noti ? Object.assign(noti, body).save() : null))
    .then((noti) => (noti ? noti.view() : null))
    .then(success(res))
    .catch(next);
