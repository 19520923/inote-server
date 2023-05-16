import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Message } from ".";
import _ from "lodash";
import { getAnswer } from "../../services/openai";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Message.create({ ...body, author: user })
    .then(async (message) => {
      if (body.to && _.includes(["6463b56b2f752e93d06cf8a6"], body.to)) {
        const reply_content = await getAnswer(message.content);
        console.log(reply_content)
        if (reply_content) {
          await Message.create({
            author: "6463b56b2f752e93d06cf8a6",
            content: reply_content,
            reply_to: [message.id],
            project: message.project,
          });
        }
      }
      return message
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
          rows: messages.map((message) => message.view()),
        })
      )
    )
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Message.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((message) =>
      message ? Object.assign(message, _.pickBy(body, _.identity)).save() : null
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
