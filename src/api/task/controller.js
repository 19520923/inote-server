import { success, notFound } from "../../services/response/";
import { Task } from ".";
import { Notification } from "../notification";
import { Project } from "../project";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Project.findById(body.project)
    .then(notFound(res))
    .then((project) =>
      Task.count({ project: body.project }).then((count) =>
        Task.create({
          ...body,
          registered_by: user,
          key: `${project.acronym}_${count + 1}`,
        })
          .then((task) => task.view(true))
          .then(success(res, 201))
          .catch(next)
      )
    );

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Task.count({ ...query, deleted_flag: false })
    .then((count) =>
      Task.find({ ...query, deleted_flag: false }, select, cursor).then(
        (tasks) => ({
          count,
          rows: tasks.map((task) => task.view()),
        })
      )
    )
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Task.findById(params.id)
    .then(notFound(res))
    .then((task) => (task ? task.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Task.findById(params.id)
    .then(notFound(res))
    .then((task) => (task ? Object.assign(task, body).save() : null))
    .then(async (task) => {
      if (task) {
        if (user.id !== task.author.id) {
          await Notification.create({
            content: `${task.subject} (${task.key}) has been updated`,
            author: user,
            type: "task",
            receiver: task.author.id,
            data: task.id,
          });
        }
        if (task.assignee) {
          await Notification.create({
            content: `${task.subject} (${task.key}) has been updated`,
            author: user,
            type: "task",
            receiver: task.assignee.id,
            data: task.id,
          });
        }
        return task;
      }
      return null;
    })
    .then((task) => (task ? task.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Task.findById(params.id)
    .then(notFound(res))
    .then((task) => (task ? task.remove() : null))
    .then(success(res, 204))
    .catch(next);
