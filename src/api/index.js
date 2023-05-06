import { Router } from "express";
import user from "./user";
import auth from "./auth";
import passwordReset from "./password-reset";
import job from "./job";
import interest from "./interest";
import category from "./category";
import note from "./note";
import notification from "./notification";
import project from "./project";
import milestone from "./milestone";
import task from "./task";
import reminder from "./reminder";
import comment from "./comment";
import message from "./message";
import verifyCode from "./verify-code";

const router = new Router();

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */
router.use("/users", user);
router.use("/auth", auth);
router.use("/password-resets", passwordReset);
router.use("/jobs", job);
router.use("/interests", interest);
router.use("/categories", category);
router.use("/notes", note);
router.use("/notifications", notification);
router.use("/projects", project);
router.use("/milestones", milestone);
router.use("/tasks", task);
router.use("/reminders", reminder);
router.use("/comments", comment);
router.use("/messages", message);
router.use("/verify-code", verifyCode);

export default router;
