import { Router } from "express";
import {
  getClassroomDetails,
  createClass,
} from "#controllers/classroom.controller.js";
const router = Router();

router.route("/:floorNo").get(getClassroomDetails).post(createClass);

export default router;
