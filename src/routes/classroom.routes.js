import { Router } from "express";
import {
  getClassroomDetails,
  createClass,
  addClass,
  createClassSlots,
  hardwareClassAllocation,
} from "#controllers/classroom.controller.js";

const router = Router();

router.route(`/slots`).post(createClassSlots);

router.route(`/hwClass`).get(hardwareClassAllocation);
router
  .route("/:floorNo")
  .get(getClassroomDetails)
  .post(createClass)
  .patch(addClass);
export default router;
