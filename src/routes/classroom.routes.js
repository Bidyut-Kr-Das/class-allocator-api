import { Router } from "express";
import {
  getClassroomDetails,
  createClass,
  addClass,
  createClassSlots,
  hardwareClassAllocation,
  getClassStartTime,
} from "../controllers/classroom.controller.js";

const router = Router();

router.route(`/slots`).get(getClassStartTime).post(createClassSlots);

router.route(`/hwClass`).get(hardwareClassAllocation);
router
  .route("/:floorNo")
  .get(getClassroomDetails)
  .post(createClass)
  .patch(addClass);
export default router;
