import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Message } from ".";
import _ from "lodash";
import { getAnswer } from "../../services/openai";
import { Notification } from "../notification";
import { botId } from "../../config";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Message.create({ ...body, author: user })
    .then(async (message) => {
      const isReplyToBot = body.reply_to && body.reply_to === botId;
      const isToBot = body.to && _.includes(body.to, botId);
      if (isReplyToBot || isToBot) {
        const reply_content = await getAnswer(message.content);
        if (reply_content) {
          await Message.create({
            author: botId,
            content: reply_content,
            reply_to: message.id,
            project: message.project,
          });
        }
      } else {
        if (message.to && message.to.length) {
          message.to.forEach(async (t) => {
            await Notification({
              content: `${user.fullname} mention you in chat "${message.content}"`,
              author: user,
              type: "chat",
              receiver: t,
              project: message.project,
            });
          });
        }
        if (message.reply_to) {
          await Notification({
            content: `${user.fullname} reply you in chat "${message.content}"`,
            author: user,
            type: "task",
            receiver: message.reply_to,
            project: message.project,
          });
        }
      }
      return message;
    })
    .then((message) => message.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Message.count({ ...query, deleted_flag: false })
    .then((count) =>
      Message.find({ ...query, deleted_flag: false }, select, cursor).then(
        (messages) => ({
          count,
          rows: messages.map((message) => message.view(true)),
        })
      )
    )
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) =>
  Message.findById(params.id)
    .then(notFound(res))
    .then((message) =>
      message ? Object.assign(message, _.omitBy(body, _.isNil)).save() : null
    )
    .then((message) => (message ? message.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Message.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((message) => (message ? message.remove() : null))
    .then(success(res, 204))
    .catch(next);
