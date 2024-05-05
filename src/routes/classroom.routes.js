import { Router } from "express";
import {
  getClassroomDetails,
  createClass,
  addClass,
} from "#controllers/classroom.controller.js";
const router = Router();

router
  .route("/:floorNo")
  .get(getClassroomDetails)
  .post(createClass)
  .patch(addClass);

export default router;
