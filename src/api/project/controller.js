import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Project } from ".";
import { Notification } from "../notification";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Project.create({ ...body, author: user })
    .then((project) => {
      project.members.forEach(async (member) => {
        await Notification.create({
          content: `You have been invited to project ${project.name} (${project.acronym}) as a member`,
          author: user,
          type: "project",
          receiver: member.id,
          data: project.id,
        });
      });
      project.hosts.forEach(async (host) => {
        await Notification.create({
          content: `You have been invited to project ${project.name} (${project.acronym}) as a host`,
          author: user,
          type: "project",
          receiver: host.id,
          data: project.id,
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
    $or: [{ author: user }, { hosts: user }, { members: user }],
    deleteFlag: false,
  })
    .then((count) =>
      Project.find(
        {
          ...query,
          $or: [{ author: user }, { hosts: user }, { members: user }],
          deleteFlag: false,
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
    .then((project) => (project ? project.view(true) : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then((project) => {
      const hostIndex = project.hosts.findIndex((host) => host.id === user.id);
      if (hostIndex === -1 && project.author !== user.id) {
        res.status(403).end();
        return null;
      }
      return project;
    })
    .then((project) => (project ? Object.assign(project, body).save() : null))
    .then((project) => {
      if (project) {
        project.members.forEach(async (member) => {
          await Notification.create({
            content: `${project.name} (${project.acronym}) has been updated`,
            author: user,
            type: "project",
            receiver: member,
            data: project.id,
          });
          project.hosts.forEach(async (host) => {
            await Notification.create({
              content: `You have been invited to project ${project.name} (${project.acronym}) as a host`,
              author: user,
              type: "project",
              receiver: host.id,
              data: project.id,
            });
          });
        });
        return project;
      }
      return null;
    })
    .then((project) => (project ? project.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then((project) => (project ? project.remove() : null))
    .then(success(res, 204))
    .catch(next);
