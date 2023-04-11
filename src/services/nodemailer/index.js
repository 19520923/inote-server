import nodemailer from "nodemailer";
import {
  clientId,
  email,
  password,
  clientSecret,
  refreshToken,
} from "../../config";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: email,
    pass: password,
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
  },
});

export const sendMail = (mail) =>
  transporter.sendMail({ ...mail, from: email }, (err) => console.log(err));


export const sendVeridicationCode = (user, verify) => {
  
}