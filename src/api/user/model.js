import crypto from "crypto";
import bcrypt from "bcrypt";
import randtoken from "rand-token";
import mongoose, { Schema } from "mongoose";
import mongooseKeywords from "mongoose-keywords";
import { env } from "../../config";
import { USER_GENDER, USER_ROLES } from "../../constants";

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    fullname: {
      type: String,
      index: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    avatar: {
      type: String,
      trim: true,
    },
    date_of_birth: {
      type: Date,
      max: new Date(),
      min: new Date("01/01/1900"),
    },
    about: {
      type: String,
    },
    job: {
      type: Schema.ObjectId,
      ref: "Job",
    },
    gender: {
      type: String,
      enum: USER_GENDER,
    },
    is_first_login: {
      type: Boolean,
      default: true,
    },
    interests: [
      {
        type: Schema.ObjectId,
        ref: "Interest",
      },
    ],
    deleted_flag: {
      type: Boolean,
      default: false,
    },
    services: {
      google: String,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "user",
    },
    firebase_token: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

userSchema.path("email").set(function (email) {
  if (!this.avatar || this.avatar.indexOf("https://gravatar.com") === 0) {
    const hash = crypto.createHash("md5").update(email).digest("hex");
    this.avatar = `https://gravatar.com/avatar/${hash}?d=identicon`;
  }

  if (!this.name) {
    this.name = email.replace(/^(.+)@.+$/, "$1");
  }

  return email;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  /* istanbul ignore next */
  const rounds = env === "test" ? 1 : 9;

  bcrypt
    .hash(this.password, rounds)
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch(next);
});

userSchema.methods = {
  view(full) {
    const view = {};
    let fields = ["id", "fullname", "avatar", "username"];

    if (full) {
      fields = [
        ...fields,
        "email",
        "phone",
        "created_at",
        "updated_at",
        "date_of_birth",
        "about",
        "job",
        "is_first_login",
        "deleted_flag",
        "interests",
        "gender",
      ];
    }

    fields.forEach((field) => {
      view[field] = this[field];
    });

    return view;
  },

  authenticate(password) {
    return bcrypt
      .compare(password, this.password)
      .then((valid) => (valid ? this : false));
  },
};

userSchema.statics = {
  USER_ROLES,
  createFromService({ service, id, email, name, avatar }) {
    return this.findOne({
      $or: [{ [`services.${service}`]: id }, { email }],
    }).then((user) => {
      if (user) {
        user.services[service] = id;
        user.fullname = fullname;
        user.avatar = avatar;
        return user.save();
      } else {
        const password = randtoken.generate(16);
        return this.create({
          services: { [service]: id },
          email,
          password,
          name,
          avatar,
        });
      }
    });
  },
};

userSchema.plugin(mongooseKeywords, {
  paths: ["email", "fullname", "username"],
});

const model = mongoose.model("User", userSchema);

export const schema = model.schema;
export default model;
