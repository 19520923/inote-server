import { success, notFound } from "../../services/response/";
import { PasswordReset } from ".";
import { User } from "../user";
import { sendMail } from "../../services/nodemailer";

export const create = (
  {
    bodymen: {
      body: { email },
    },
  },
  res,
  next
) =>
  User.findOne({ email })
    .then(notFound(res))
    .then((user) => (user ? PasswordReset.create({ user }) : null))
    .then((reset) => {
      if (!reset) return null;
      const { user, token } = reset;
      const content = `
        Hey, ${user.fullname}.<br><br>
        You requested a new password for your INote account.<br>
        Please use the following verification code to set a new password. It will expire in 1 hour.<br><br>
        <h1>${token}</h1>
        If you didn't make this request then you can safely ignore this email. :)<br><br>
        &mdash; INote Team
      `;
      sendMail({ subject: "Reset password", to: user.email, html: content });
      return 201;
      // return sendMail({ toEmail: email, subject: 'INote - Password Reset', content })
    })
    .then((response) => (response ? res.status(response).end() : null))
    .catch(next);

export const show = ({ params: { token } }, res, next) =>
  PasswordReset.findOne({ token })
    .populate("user")
    .then(notFound(res))
    .then((reset) => (reset ? reset.view(true) : null))
    .then(success(res))
    .catch(next);

export const update = (
  {
    params: { token },
    bodymen: {
      body: { password },
    },
  },
  res,
  next
) => {
  return PasswordReset.findOne({ token })
    .populate("user")
    .then(notFound(res))
    .then((reset) => {
      if (!reset) return null;
      const { user } = reset;
      return user
        .set({ password })
        .save()
        .then(() => PasswordReset.deleteMany({ user }))
        .then(() => user.view(true));
    })
    .then(success(res))
    .catch(next);
};
