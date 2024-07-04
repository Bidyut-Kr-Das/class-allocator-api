import { Router } from "express";
import { getTeachers, checkTeacher } from "#controllers/teacher.controller.js";

const router = Router();

router.route("/").get(getTeachers);
router.route("/check").get(checkTeacher);

export default router;
