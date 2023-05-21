import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Note } from ".";
import _ from "lodash";
import { mongooseObjectID } from "../../constants";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Note.create({ ...body, author: user })
    .then((note) => note.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = (
  { user, querymen: { query, select, cursor } },
  res,
  next
) =>
  Note.count({ ...query, author: user, deleted_flag: false })
    .then((count) =>
      Note.find(
        { ...query, author: user, deleted_flag: false },
        select,
        cursor
      ).then((notes) => ({
        count,
        rows: notes.map((note) => note.view()),
      }))
    )
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Note.findById(params.id)
    .then(notFound(res))
    .then((note) => (note ? note.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Note.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((note) => (note ? Object.assign(note, body).save() : null))
    .then((note) => (note ? note.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Note.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((note) => (note ? note.remove() : null))
    .then(success(res, 204))
    .catch(next);

export const sync = async ({ user, bodymen: { body } }, res, next) => {
  const res_data = await Promise.all(
    body.notes.map((n, index) =>
      mongooseObjectID.test(n.id)
        ? Note.findById(n.id)
            .then((note) =>
              note
                ? Object.assign(note, _.omitBy(n, _.isNil)).save()
                : Note.create({ ...n, author: user })
            )
            .then((note) => note.view(true))
            .then((note) => ({ id: n.id, note: note }))
            .catch((error) => ({
              index: index,
              error: _.get(error, "message", "Internal server"),
            }))
        : Note.create({ ...n, author: user })
            .then((note) => note.view(true))
            .then((note) => ({ id: n.id, note: note }))
            .catch((error) => ({
              index: index,
              error: _.get(error, "message", "Internal server"),
            }))
    )
  );
  res.status(200).json({ notes: res_data }).end();
  next();
};
