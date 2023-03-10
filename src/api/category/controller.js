import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Category } from ".";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Category.create({ ...body, author: user })
    .then((category) => category.view())
    .then(success(res, 201))
    .catch(next);

export const index = (
  { user, querymen: { query, select, cursor } },
  res,
  next
) =>
  Category.count({ ...query, author: user })
    .then((count) =>
      Category.find({ ...query, author: user }, select, cursor).then(
        (categories) => ({
          count,
          rows: categories.map((category) => category.view()),
        })
      )
    )
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Category.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((category) =>
      category ? Object.assign(category, body).save() : null
    )
    .then((category) => (category ? category.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Category.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((category) => (category ? category.remove() : null))
    .then(success(res, 204))
    .catch(next);
