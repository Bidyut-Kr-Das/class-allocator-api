import { Router } from "express";
import { getTeachers } from "#controllers/teacher.controller.js";

const router = Router();

router.route("/").get(getTeachers);

export default router;
