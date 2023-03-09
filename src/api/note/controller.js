import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Note } from ".";

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
  Note.count({ ...query, author: user })
    .then((count) =>
      Note.find({ ...query, author: user }, select, cursor).then((notes) => ({
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
