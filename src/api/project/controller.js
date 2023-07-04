import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Project } from ".";
import { Notification } from "../notification";
import { botId } from "../../config";
import _ from "lodash";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Project.create({
    ...body,
    members: [...(body.members || []), botId],
    author: user,
  })
    .then((project) => {
      project.members.forEach(async (member) => {
        await Notification.create({
          content: `You have been invited to project ${project.name} (${project.acronym}) as a member`,
          author: user,
          type: "project",
          receiver: member.id,
          project: project.id,
        });
      });
      project.hosts.forEach(async (host) => {
        await Notification.create({
          content: `You have been invited to project ${project.name} (${project.acronym}) as a host`,
          author: user,
          type: "project",
          receiver: host.id,
          project: project.id,
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
    deleted_flag: false,
  })
    .then((count) =>
      Project.find(
        {
          ...query,
          $or: [{ author: user }, { hosts: user }, { members: user }],
          deleted_flag: false,
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
      if (hostIndex === -1 && project.author.id !== user.id) {
        res.status(403).json("Don't have permission").end();
        return null;
      }
      return project;
    })
    .then((project) =>
      project ? Object.assign(project, _.omitBy(body, _.isNil)).save() : null
    )
    .then((project) => {
      if (project) {
        project.members.forEach(async (member) => {
          await Notification.create({
            content: `${project.name} (${project.acronym}) has been updated`,
            author: user,
            type: "project",
            receiver: member,
            project: project.id,
          });
          project.hosts.forEach(async (host) => {
            await Notification.create({
              content: `${project.name} (${project.acronym}) has been updated`,
              author: user,
              type: "project",
              receiver: host.id,
              project: project.id,
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

export const addMembers = ({ user, params, bodymen: { body } }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then((project) => {
      if (!project) {
        return null;
      }
      const unique = _.uniq(body.members);
      const notExisted = _.difference(unique, [
        ...project.members.map((member) => member.id),
        ...project.hosts.map((host) => host.id),
      ]);

      if (notExisted.length > 0) {
        notExisted.forEach(async (e) => {
          await Notification.create({
            content: `${project.name} (${project.acronym}) has been invited you as a member`,
            author: user,
            type: "project",
            receiver: e,
            project: project.id,
          });
        });
        project.members.push(...notExisted);
        return project.save();
      }
      return project;
    })
    .then((project) => (project ? project.view(true) : null))
    .then(success(res))
    .catch(next);

export const removeMembers = ({ user, params, bodymen: { body } }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then((project) => {
      if (!project) {
        return null;
      }
      const unique = _.uniq(body.members);
      const memberIds = project.members.map((member) => member.id);
      if (memberIds.length > 0) {
        const newMemberIds = _.difference(memberIds, unique);
        unique.forEach(async (e) => {
          await Notification.create({
            content: `${project.name} (${project.acronym}) has been remove you`,
            author: user,
            type: "project",
            receiver: e,
            project: project.id,
          });
        });
        return project.set({ members: newMemberIds }).save();
      }
      return project;
    })
    .then((project) => (project ? project.view(true) : null))
    .then(success(res))
    .catch(next);

export const addHosts = ({ user, params, bodymen: { body } }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((project) => {
      if (!project) {
        return null;
      }
      const unique = _.uniq(body.hosts);
      const notExisted = _.difference(unique, [
        ...project.hosts.map((host) => host.id),
        ...project.members.map((member) => member.id),
      ]);

      if (notExisted.length > 0) {
        notExisted.forEach(async (e) => {
          await Notification.create({
            content: `${project.name} (${project.acronym}) has been invited you as a host`,
            author: user,
            type: "project",
            receiver: e,
            project: project.id,
          });
        });
        project.hosts.push(...notExisted);
        return project.save();
      }
      return project;
    })
    .then((project) => (project ? project.view(true) : null))
    .then(success(res))
    .catch(next);

export const removeHosts = ({ user, params, bodymen: { body } }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((project) => {
      if (!project) {
        return null;
      }
      const unique = _.uniq(body.hosts);
      const hostIds = project.hosts.map((host) => host.id);
      if (hostIds.length > 0) {
        unique.forEach(async (e) => {
          await Notification.create({
            content: `${project.name} (${project.acronym}) has been remove you`,
            author: user,
            type: "project",
            receiver: e,
            project: project.id,
          });
        });
        const newHostIds = _.difference(hostIds, unique);
        return project.set({ hosts: newHostIds }).save();
      }
      return project;
    })
    .then((project) => (project ? project.view(true) : null))
    .then(success(res))
    .catch(next);
