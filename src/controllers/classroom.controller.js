import ApiError from "#utils/apiError.js";

import catchAsyncError from "#utils/catchAsyncError.js";
import Classroom from "../models/classroom.model.js";

export const getClassroomDetails = catchAsyncError(async (req, res, _) => {
  // console.log(req.params.floorNo);
  // console.log(req.query);
  const { room } = req.query;

  // const classroom = await Classroom.findOne({
  //   roomNo: room,
  // });

  const data = await Classroom.aggregate([
    {
      $match: {
        roomNo: room,
      },
    },
    {
      $unwind: "$classes",
    },
    {
      $lookup: {
        from: "teachers",
        localField: "classes.teacher",
        foreignField: "_id",
        as: "teacherDetails",
      },
    },
    {
      $unwind: "$teacherDetails",
    },
    {
      $addFields: {
        "classes.teacher": "$teacherDetails.name",
      },
    },
    {
      $group: {
        _id: "$roomNo",
        classes: {
          $push: "$classes",
        },
      },
    },
    {
      $project: {
        "classes.batch": 1,
        "classes.teacher": 1,
        "classes.startTime": 1,
        "classes.endTime": 1,
        _id: 0,
      },
    },
  ]);

  console.log(data[0].classes);

  res.status(200).json({
    status: "success",
    message: "Classroom details fetched successfully",
    classes: data[0].classes,
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

  let endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);
  endTime = endTime.toISOString();

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

export const addClass = catchAsyncError(async (req, res, _) => {
  const { room } = req.query;
  const { floorNo } = req.params;
  const { batch, teacherId } = req.body;

  const startTime = new Date().toISOString();

  let endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);
  endTime = endTime.toISOString();

  const newData = await Classroom.findOneAndUpdate(
    { roomNo: room },
    {
      $push: {
        classes: {
          batch,
          teacher: teacherId,
          startTime,
          endTime,
        },
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Class added successfully",
    data: newData,
  });
});
