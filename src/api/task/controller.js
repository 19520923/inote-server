import { success, notFound } from "../../services/response/";
import { Task } from ".";
import { Notification } from "../notification";
import { Project } from "../project";
import { Comment } from "../comment";
import { getChangesContent } from "../../utils/comment";
import _ from "lodash";

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
          .then(async (task) => {
            await Comment.create({
              task: task.id,
              author: user,
              content: "Create new task",
            });
            return task;
          })
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
    .then(async (task) => {
      if (!task) return null;
      const oldTask = _.cloneDeep(task);
      const newTask = Object.assign(task, _.omitBy(body, _.isNil));
      const changes = task.getChanges().$set;
      await Comment.create({
        author: user,
        task: task.id,
        content: getChangesContent(oldTask, changes),
      });
      return newTask.save();
    })
    // .then((task) => (task ? Object.assign(task, body).save() : null))
    .then(async (task) => {
      if (task) {
        if (user.id !== task.registered_by.id) {
          await Notification.create({
            content: `${task.subject} (${task.key}) has been updated`,
            author: user,
            type: "task",
            receiver: task.registered_by.id,
            data: task.id,
            project: task.project,
          });
        }
        if (task.assignee) {
          await Notification.create({
            content: `${task.subject} (${task.key}) has been updated`,
            author: user,
            type: "task",
            receiver: task.assignee.id,
            data: task.id,
            project: task.project,
          });
        }
        return task;
      }
      return null;
    })
    .then((task) => (task ? task.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Task.findById(params.id)
    .then(notFound(res))
    .then((task) => (task ? task.remove() : null))
    .then(success(res, 204))
    .catch(next);

export const report = ({ querymen: { query } }, res, next) =>
  Task.count({ ...query, deleted_flag: false })
    .then(async (count) => {
      const low = await Task.count({
        ...query,
        deleted_flag: false,
        priority: "low",
      });
      const normal = await Task.count({
        ...query,
        deleted_flag: false,
        priority: "normal",
      });
      const high = await Task.count({
        ...query,
        deleted_flag: false,
        priority: "high",
      });
      const important = await Task.count({
        ...query,
        deleted_flag: false,
        priority: "important",
      });

      const open = await Task.count({
        ...query,
        deleted_flag: false,
        status: "open",
      });
      const in_progress = await Task.count({
        ...query,
        deleted_flag: false,
        status: "in_progress",
      });
      const resolved = await Task.count({
        ...query,
        deleted_flag: false,
        status: "resolved",
      });
      const closed = await Task.count({
        ...query,
        deleted_flag: false,
        status: "closed",
      });
      const pending = await Task.count({
        ...query,
        deleted_flag: false,
        status: "pending",
      });

      return {
        total: count,
        low: low,
        normal: normal,
        high: high,
        important: important,
        open: open,
        in_progress: in_progress,
        resolved: resolved,
        closed: closed,
        pending: pending,
      };
    })
    .then(success(res))
    .catch(next);
