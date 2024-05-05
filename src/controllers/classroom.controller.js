import ApiError from "#utils/apiError.js";

import catchAsyncError from "#utils/catchAsyncError.js";
import Classroom from "../models/classroom.model.js";

export const getClassroomDetails = catchAsyncError(async (req, res, _) => {
  console.log(req.params.floorNo);
  console.log(req.query);
  const { room } = req.query;

  const classroom = await Classroom.findOne({
    roomNo: room,
  });

  const classes = classroom.classes;

  res.status(200).json({
    status: "success",
    message: "Classroom details fetched successfully",
    classes,
  });
});

export const createClass = catchAsyncError(async (req, res, _) => {
  const { floorNo } = req.params;
  if (floorNo > 5 || floorNo < 0) {
    return new ApiError(
      401,
      `floor no exceeds the actual building 0_0. Lift broke through the ceiling.... weeeeeee!!!`
    );
  }
  const { room } = req.query;
  const { batch, teacherId } = req.body;
  const startTime = new Date().toISOString();
  console.log(startTime);
  let endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);
  endTime = endTime.toISOString();
  console.log(endTime);
  const newClassroom = await Classroom.create({
    roomNo: room,
    floorNo,
    classes: [
      {
        batch,
        teacher: teacherId,
        startTime,
        endTime,
      },
    ],
  });

  res.status(201).json({
    status: "success",
    message: "Class created successfully",
    data: newClassroom,
  });
});
