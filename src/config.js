/* eslint-disable no-unused-vars */
import path from "path";
import merge from "lodash/merge";

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error("You must set the " + name + " environment variable");
  }
  return process.env[name];
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv-safe");
  dotenv.config({
    path: path.join(__dirname, "../.env"),
    example: path.join(__dirname, "../.env.example"),
  });
}

const config = {
  all: {
    env: process.env.NODE_ENV || "development",
    root: path.join(__dirname, ".."),
    port: process.env.PORT || 9000,
    ip: process.env.IP || "0.0.0.0",
    apiRoot: process.env.API_ROOT || "",
    defaultEmail: "no-reply@i-note.com",
    masterKey: requireProcessEnv("MASTER_KEY"),
    jwtSecret: requireProcessEnv("JWT_SECRET"),
    clientId: requireProcessEnv("OAUTH_CLIENTID"),
    clientSecret: requireProcessEnv("OAUTH_CLIENT_SECRET"),
    email: requireProcessEnv("MAIL_USERNAME"),
    password: requireProcessEnv("MAIL_PASSWORD"),
    refreshToken: requireProcessEnv("OAUTH_REFRESH_TOKEN"),
    openai: requireProcessEnv("OPENAI_SECRET_KEY"),
    botId: requireProcessEnv("BOT_ID"),

    mongo: {
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      },
    },
  },
  test: {},
  development: {
    mongo: {
      uri: "mongodb+srv://admin:admin@cluster0.dqfifjx.mongodb.net/?retryWrites=true&w=majority",
      options: {
        debug: true,
      },
    },
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri:
        process.env.MONGODB_URI ||
        "mongodb+srv://admin:admin@cluster0.dqfifjx.mongodb.net/?retryWrites=true&w=majority",
    },
  },
};

module.exports = merge(config.all, config[config.all.env]);
export default module.exports;
