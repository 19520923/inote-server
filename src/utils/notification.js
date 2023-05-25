import { Project } from "../api/project";
import { User } from "../api/user";
import admin from "../services/firebase-admin";

export const getTokensFromProjectId = async (project_id) => {
  const projects = await Project.findById(project_id);
  const tokens = projects.members.map((member) => {
    if (member.firebase_token) {
      return member.firebase_token;
    }
  });
  return tokens;
};

export const sendToUser = async (user_id, notification) => {
  const user = await User.findById(user_id);
  if (user.firebase_token) {
    admin
      .messaging()
      .send({ notification, token: user.firebase_token })
      .then((value) => console.log(value))
      .catch((err) => console.log(err));
  }
};
