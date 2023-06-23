import { success, notFound, authorOrAdmin } from '../../services/response/'
import { TaskReview } from '.'
import _ from 'lodash';

export const create = ({ user, bodymen: { body } }, res, next) =>
  TaskReview.create({ ...body, author: user })
    .then((taskReview) => taskReview.view())
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  TaskReview.count(query)
    .then(count => TaskReview.find(query, select, cursor)
      .then((taskReviews) => ({
        count,
        rows: taskReviews.map((taskReview) => taskReview.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  TaskReview.findById(params.id)
    .then(notFound(res))
    .then((taskReview) =>
      taskReview
        ? Object.assign(taskReview, _.omitBy(body, _.isNil)).save()
        : null
    )
    .then((taskReview) => (taskReview ? taskReview.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  TaskReview.findById(params.id)
    .then(notFound(res))
    .then((taskReview) => taskReview ? taskReview.remove() : null)
    .then(success(res, 204))
    .catch(next)
