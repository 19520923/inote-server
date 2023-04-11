import { success, notFound } from "../../services/response/";
import { Job } from ".";

export const create = ({ bodymen: { body } }, res, next) =>
  Job.create(body)
    .then((job) => job.view())
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Job.count({ ...query, deleted_flag: false })
    .then((count) =>
      Job.find({ ...query, deleted_flag: false }, select, cursor).then(
        (jobs) => ({
          count,
          rows: jobs.map((job) => job.view()),
        })
      )
    )
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) =>
  Job.findById(params.id)
    .then(notFound(res))
    .then((job) => (job ? Object.assign(job, body).save() : null))
    .then((job) => (job ? job.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Job.findById(params.id)
    .then(notFound(res))
    .then((job) => (job ? job.remove() : null))
    .then(success(res, 204))
    .catch(next);
