import { success, notFound } from "../../services/response/";
import { Mileston } from ".";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Mileston.create({ ...body, author: user })
    .then((mileston) => mileston.view())
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Mileston.count({ ...query, deleteFlag: false })
    .then((count) =>
      Mileston.find({ ...query, deleteFlag: false }, select, cursor).then(
        (milestons) => ({
          count,
          rows: milestons.map((mileston) => mileston.view()),
        })
      )
    )
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Mileston.findById(params.id)
    .then(notFound(res))
    .then((mileston) =>
      mileston ? Object.assign(mileston, body).save() : null
    )
    .then((mileston) => (mileston ? mileston.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Mileston.findById(params.id)
    .then(notFound(res))
    .then((mileston) => (mileston ? mileston.remove() : null))
    .then(success(res, 204))
    .catch(next);
