import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Category } from ".";
import _ from "lodash";
import { mongooseObjectID } from "../../constants";

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

export const sync = async ({ user, bodymen: { body } }, res, next) => {
    const res_data = await Promise.all(
      body.categories.map((cate, index) =>
        mongooseObjectID.test(cate.id)
          ? Category.findById(cate.id)
              .then((category) =>
                category
                  ? Object.assign(category, _.pickBy(cate, _.identity)).save()
                  : Category.create({ ...cate, author: user })
              )
              .then((category) => category.view())
              .then((category) => ({ id: cate.id, category: category }))
              .catch((error) => ({
                index: index,
                error: _.get(error, "message", "Internal server"),
              }))
          : Category.create({ ...cate, author: user })
              .then((category) => category.view())
              .then((category) => ({ id: cate.id, category: category }))
              .catch((error) => ({
                index: index,
                error: _.get(error, "message", "Internal server"),
              }))
      )
    );
    res.status(200).json({ categories: res_data }).end();
  
  next();
};
