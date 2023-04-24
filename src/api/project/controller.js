import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Project } from ".";
import { Notification } from "../notification";
import _ from "lodash";

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

export const addMembers = ({ user, params, bodymen: { body } }, res, next) =>
  Project.findById(params.id)
    .then(notFound(res))
    .then((project) => {
      if (!project) {
        return null;
      }
      const unique = _.uniq(body.members);
      const notExisted = _.difference(
        unique,
        project.members.map((member) => member.id)
      );
      const noHosts = _.difference(
        notExisted,
        project.hosts.map((host) => host.id)
      );
      if (noHosts.length > 0) {
        noHosts.forEach(async (e) => {
          await Notification.create({
            content: `${project.name} (${project.acronym}) has been invited you as a member`,
            author: user,
            type: "project",
            receiver: e,
            data: project.id,
          });
        });
        project.members.push(...noHosts);
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
            data: project.id,
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
      const notExisted = _.difference(
        unique,
        project.hosts.map((host) => host.id)
      );
      const noMembers = _.difference(
        notExisted,
        project.members.map((member) => member.id)
      );
      if (noMembers.length > 0) {
        noMembers.forEach(async (e) => {
          await Notification.create({
            content: `${project.name} (${project.acronym}) has been invited you as a host`,
            author: user,
            type: "project",
            receiver: e,
            data: project.id,
          });
        });
        project.hosts.push(...noMembers);
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
            data: project.id,
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
