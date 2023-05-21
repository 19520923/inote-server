import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Reminder } from ".";
import _ from "lodash";

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
      reminder
        ? Object.assign(reminder, _.omitBy(body, _.isNil)).save()
        : null
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

export const sync = async ({ user, bodymen: { body } }, res, next) => {
  const res_data = await Promise.all(
    body.reminders.map((r, index) =>
      r.id
        ? Reminder.findById(r.id)
            .then((reminder) =>
              reminder
                ? Object.assign(reminder, _.omitBy(r, _.isNil)).save()
                : Reminder.create({ ...r, author: user })
            )
            .then((reminder) => reminder.view(true))
            .then((reminder) => ({ index: index, reminder: reminder }))
            .catch((error) => ({
              index: index,
              error: _.get(error, "message", "Internal server"),
            }))
        : Reminder.create({ ...r, author: user })
            .then((reminder) => reminder.view(true))
            .then((reminder) => ({ index: index, reminder: reminder }))
            .catch((error) => ({
              index: index,
              error: _.get(error, "message", "Internal server"),
            }))
    )
  );
  res.status(200).json({ reminders: res_data }).end();
  next();
};
