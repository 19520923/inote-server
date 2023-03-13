import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Project } from ".";
import { Notification } from "../notification";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Project.create({ ...body, author: user })
    .then((project) => {
      project.members.forEach(async (member) => {
        await Notification.create({
          content: `You have been invited to project ${project.name} (${project.acronym})`,
          author: user,
          type: "project",
          receiver: member,
        });
      });
      return project;
    })
    .then((project) => project.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = (
  { user, querymen: { query, select, cursor } },
  res,
  next
) =>
  Project.count({
    ...query,
    $or: [{ author: user }, { host: user }, { members: user }],
  })
    .then((count) =>
      Project.find(
        {
          ...query,
          $or: [{ author: user }, { host: user }, { members: user }],
        },
        select,
        cursor
      ).then((projects) => ({
        count,
        rows: projects.map((project) => project.view()),
      }))
    )
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then((project) => (project ? project.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then(authorOrAdmin(res, user, "host"))
    .then((project) => (project ? Object.assign(project, body).save() : null))
    .then((project) => {
      project.members.forEach(async (member) => {
        await Notification.create({
          content: `${project.name} (${project.acronym}) has been updated`,
          author: user,
          type: "project",
          receiver: member,
        });
      });
      return project;
    })
    .then((project) => (project ? project.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then(authorOrAdmin(res, user, "host"))
    .then((project) => (project ? project.remove() : null))
    .then(success(res, 204))
    .catch(next);
