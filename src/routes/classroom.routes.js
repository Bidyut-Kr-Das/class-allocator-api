import { Router } from "express";
import { getClassroomDetails } from "#controllers/classroom.controller.js";
const router = Router();

router.route("/:floorNo").get(getClassroomDetails);

export default router;
