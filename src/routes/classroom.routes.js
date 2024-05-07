import { Router } from "express";
import {
  getClassroomDetails,
  createClass,
  addClass,
  createClassSlots,
} from "#controllers/classroom.controller.js";
const router = Router();

router.route(`/slots`).post(createClassSlots);
router
  .route("/:floorNo")
  .get(getClassroomDetails)
  .post(createClass)
  .patch(addClass);
export default router;
