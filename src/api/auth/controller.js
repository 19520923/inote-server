import { sign } from "../../services/jwt";
import { notFound } from "../../services/response/";
import { success } from "../../services/response/";

export const login = ({ user }, res, next) =>
  sign(user.id)
    .then((token) => (user.verified ? { token, user: user.view(true) } : null))
    .then((data) => {
      if (!data) {
        res.status(406).end();
        return null;
      }
      return data;
    })
    .then(success(res, 201))
    .catch(next);
