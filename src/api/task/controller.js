import { success, notFound } from "../../services/response/";
import { Task } from ".";
import { Notification } from "../notification";
import { Project } from "../project";
import { Comment } from "../comment";
import { TaskReview } from "../task_review";
import { AvgTaskReview } from "../avgTaskReview";
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
          key: `${project.acronym}_${String(count + 1).padStart(4, "0")}`,
        })
          .then((task) => task.view(true))
          .then(async (task) => {
            await Comment.create({
              task: task.id,
              author: user,
              content: "◉ Create new task",
              is_system: true,
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
    .then((task) => (task ? task.view(true) : null))
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
      const savedTask = await newTask.save();
      await Comment.create({
        author: user,
        task: task.id,
        content: getChangesContent(oldTask, savedTask, changes),
        is_system: true,
      });

      if (oldTask.assignee) {
        const taskReview = await TaskReview.findOne({
          project: oldTask.project,
          "task.id": oldTask.id,
          user: oldTask.assignee,
        });
        console.log(taskReview && taskReview.task.id, oldTask.id);
        if (
          _.includes(Object.keys(changes), "assignee") &&
          String(changes["assignee"]) !== String(oldTask.assignee.id)
        ) {
          const avgTaskReview = await AvgTaskReview.findOne({
            task: oldTask,
            user: changes["assignee"],
          });

          if (!avgTaskReview) {
            await AvgTaskReview.create({
              task: oldTask,
              user: changes["assignee"],
            });
          }

          if (!taskReview) {
            const project = await Project.findById(oldTask.project);
            project.hosts.forEach(async (host) => {
              await TaskReview.create({
                author: host.id,
                project: oldTask.project,
                task: oldTask.view(true),
                user: oldTask.assignee,
                point: 0,
              });
            });
          }
        }

        if (
          _.includes(Object.keys(changes), "status") &&
          String(changes["status"]) === "resolved" &&
          !taskReview
        ) {
          const project = await Project.findById(oldTask.project);
          project.hosts.forEach(async (host) => {
            await TaskReview.create({
              author: host.id,
              project: oldTask.project,
              task: oldTask.view(true),
              user: oldTask.assignee,
              point: 0,
            });
          });
        }
      }
      return savedTask;
    })
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

      const project = await Project.findById(query.project);
      const user_reports = await Promise.all(
        [...project.members, ...project.hosts].map(async (e) => {
          const count_user_tasks = await Task.count({
            ...query,
            assignee: e.id,
            deleted_flag: false,
          });
          const low_user_tasks = await Task.count({
            ...query,
            assignee: e.id,
            deleted_flag: false,
            priority: "low",
          });
          const normal_user_tasks = await Task.count({
            ...query,
            assignee: e.id,
            deleted_flag: false,
            priority: "normal",
          });
          const high_user_tasks = await Task.count({
            ...query,
            assignee: e.id,
            deleted_flag: false,
            priority: "high",
          });
          const important_user_tasks = await Task.count({
            ...query,
            assignee: e.id,
            deleted_flag: false,
            priority: "important",
          });

          const open_user_tasks = await Task.count({
            ...query,
            assignee: e.id,
            deleted_flag: false,
            status: "open",
          });
          const in_progress_user_tasks = await Task.count({
            ...query,
            assignee: e.id,
            deleted_flag: false,
            status: "in_progress",
          });
          const resolved_user_tasks = await Task.count({
            ...query,
            assignee: e.id,
            deleted_flag: false,
            status: "resolved",
          });
          const closed_user_tasks = await Task.count({
            ...query,
            assignee: e.id,
            deleted_flag: false,
            status: "closed",
          });
          const pending_user_tasks = await Task.count({
            ...query,
            assignee: e.id,
            deleted_flag: false,
            status: "pending",
          });

          return {
            user: e.view(),
            total: count_user_tasks,
            low: low_user_tasks,
            normal: normal_user_tasks,
            high: high_user_tasks,
            important: important_user_tasks,
            open: open_user_tasks,
            in_progress: in_progress_user_tasks,
            resolved: resolved_user_tasks,
            closed: closed_user_tasks,
            pending: pending_user_tasks,
          };
        })
      );

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
        users: user_reports,
      };
    })
    .then(success(res))
    .catch(next);
