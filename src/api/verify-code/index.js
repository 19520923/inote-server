import { Router } from "express";
import { middleware as body } from "bodymen";
import { master, password } from "../../services/passport";
import { resend, verify } from "./controller";
import { schema } from "./model";
export VerifyCode, { schema } from "./model";

const router = new Router();

const { code } = schema.tree;

router.post("/", master(), password(), body({ code }), verify);
router.post("/resend", master(), password(), resend);
export default router;
