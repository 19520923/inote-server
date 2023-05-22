import { success, notFound } from "../../services/response/";
import { User } from ".";
import { VerifyCode } from "../verify-code";
import { sendMail } from "../../services/nodemailer";
import { botId } from "../../config";
import _ from "lodash";

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.count({ ...query, deleted_flag: false, _id: { $ne: botId } })
    .then((count) =>
      User.find(
        { ...query, deleted_flag: false, _id: { $ne: botId } },
        select,
        cursor
      ).then((users) => ({
        rows: users.map((user) => user.view()),
        count,
      }))
    )
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);

export const showMe = ({ user }, res) => res.json(user.view(true));

export const create = ({ bodymen: { body } }, res, next) =>
  User.create(body)
    .then(async (user) => {
      const code = Math.floor(100000 + Math.random() * 900000);
      await VerifyCode.create({
        user_id: user.id,
        email: user.email,
        code: code,
      });
      sendMail({
        subject: "Verify email",
        to: user.email,
        html: `<p>Hello,</p> <p>Before verifying your email, please confirm that the email of your INote accout is ${user.email}.</p><p><b>If the above email is correct</b>, verify by entering verification code below to application:</p><h1>${code}</h1>Incorrect email? <b>Do not verify</b>, and ignore this email.</p><p>Verification code is available in 15 minutes</p>`,
      });
      return user;
    })
    .then((user) => (user ? res.status(201).end() : null))
    .catch((err) => {
      /* istanbul ignore else */
      console.log(err);
      if (err.name === "MongoError" && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: "email",
          message: "email or phone already registered",
        });
      } else {
        next(err);
      }
    });

export const update = ({ bodymen: { body }, params, user }, res, next) =>
  User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isAdmin = user.role === "admin";
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: "You can't change other user's data",
        });
        return null;
      }
      return result;
    })
    .then((user) =>
      user ? Object.assign(user, _.omitBy(body, _.isNil)).save() : null
    )
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);

export const updatePassword = (
  { bodymen: { body }, params, user },
  res,
  next
) =>
  User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: "password",
          message: "You can't change other user's password",
        });
        return null;
      }
      return result;
    })
    .then((user) =>
      user ? user.set({ password: body.password }).save() : null
    )
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => (user ? user.remove() : null))
    .then(success(res, 204))
    .catch(next);

export const forgotPassword = ({ bodymen: { body } }, res, next) =>
  User.findOne({ email: body.email })
    .then(notFound(res))
    .then((user) => {
      if (!user) {
        return null;
      }
      const newPassword = Math.random().toString(36).substring(2, 10);
      const saved = user.set({ password: newPassword }).save();

      sendMail({
        subject: "Forgot password",
        to: user.email,
        html: `<p>Hello ${user.email},</p> <p>Your new password is:</p><h1>${newPassword}</h1><p><b>Do not share with anyone</b>, thank you</p>`,
      });
      return user;
    })
    .then(success(res))
    .catch(next);
