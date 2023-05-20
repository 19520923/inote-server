import { success, notFound, authorOrAdmin } from "../../services/response/";
import { File } from ".";

export const create = async ({ user, bodymen: { body } }, res, next) => {
  const data = await Promise.all(
    body.files.map((file) =>
      File.create({ ...file, author: user })
        .then((f) => f.view())
        .catch(next)
    )
  );
  res.status(201).json({ files: data }).end();
};

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  File.count(query)
    .then((count) =>
      File.find(query, select, cursor)
        .then((files) => ({
          count,
          rows: files.map((file) => file.view()),
        }))
    )
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  File.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "author"))
    .then((file) => (file ? Object.assign(file, body).save() : null))
    .then((file) => (file ? file.view() : null))
    .then(success(res))
    .catch(next);
