import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Reminder } from ".";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Reminder.create({ ...body, author: user })
    .then((reminder) => reminder.view())
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Reminder.count({ ...query, author: user, deleted_flag: false })
    .then((count) =>
      Reminder.find(
        { ...query, author: user, deleted_flag: false },
        select,
        cursor
      ).then((reminders) => ({
        count,
        rows: reminders.map((reminder) => reminder.view()),
      }))
    )
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Reminder.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((reminder) =>
      reminder ? Object.assign(reminder, body).save() : null
    )
    .then((reminder) => (reminder ? reminder.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Reminder.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((reminder) => (reminder ? reminder.remove() : null))
    .then(success(res, 204))
    .catch(next);
