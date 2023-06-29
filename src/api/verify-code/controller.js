import moment from "moment";
import { VerifyCode } from ".";
import { sign } from "../../services/jwt";
import { notFound, success } from "../../services/response";
import { sendMail } from "../../services/nodemailer";

export const verify = ({ user, bodymen: { body } }, res, next) =>
  VerifyCode.findOne({ user_id: user.id, code: body.code, status: 0 })
    .then(notFound(res))
    .then((verified) => {
      if (!verified) return null;
      const verified_f = verified.set({ status: 1 }).save();
      if (moment().diff(verified.created_at, "minute") > 15) {
        res.status(400).end();
        return null;
      }
      return user
        .set({ verified: true })

        .save()
        .then(async (u) => {
          await VerifyCode.deleteMany({ user_id: u.id });
          return u;
        });
    })
    .then((u) =>
      u
        ? sign(u.id)
            .then((token) =>
              u.verified ? { token, user: u.view(true) } : null
            )
            .then(notFound(res))
            .then(success(res, 201))
            .catch(next)
        : null
    )
    .catch(next);

export const resend = ({ user }, res, next) =>
  VerifyCode.create({
    user_id: user.id,
    email: user.email,
  })
    .then((verify) => {
      sendMail({
        subject: "Verify email",
        to: user.email,
        html: `<p>Hello,</p> <p>Before verifying your email, please confirm that the email of your INote accout is ${user.email}.</p><p><b>If the above email is correct</b>, verify by entering verification code below to application:</p><h1>${verify.code}</h1>Incorrect email? <b>Do not verify</b>, and ignore this email.</p><p>Verification code is available in 15 minutes</p>`,
      });
      res.status(200).end();
      return verify;
    })
    .catch(next);
