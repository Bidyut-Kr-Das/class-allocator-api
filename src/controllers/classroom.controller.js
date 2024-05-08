import ApiError from "#utils/apiError.js";

import catchAsyncError from "#utils/catchAsyncError.js";
import Classroom from "../models/classroom.model.js";
import ClassSlot from "../models/classSlots.model.js";

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
        roomNo: "403",
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
        "classes.startTime": {
          $arrayElemAt: ["$classes.slots", 0],
        },
        "classes.endTime": {
          $arrayElemAt: ["$classes.slots", -1],
        },
      },
    },
    {
      $lookup: {
        from: "classslots",
        localField: "classes.startTime",
        foreignField: "slot",
        as: "startSlot",
      },
    },
    {
      $lookup: {
        from: "classslots",
        localField: "classes.endTime",
        foreignField: "slot",
        as: "endSlot",
      },
    },
    {
      $unwind: "$startSlot",
    },
    {
      $unwind: "$endSlot",
    },
    {
      $project: {
        "classes.batch": 1,
        "classes.teacher": 1,
        "classes.startTime": "$startSlot.startTime",
        "classes.endTime": "$endSlot.endTime",
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
  ]);

  // console.log(data[0].classes);

  res.status(200).json({
    status: "success",
    message: "Classroom details fetched successfully",
    classes: data[0].classes,
  });
});

export const createClass = catchAsyncError(async (req, res, _) => {
  let { floorNo } = req.params;
  if (floorNo > 5 || floorNo < 0) {
    return new ApiError(
      401,
      `floor no exceeds the actual building 0_0. Lift broke through the ceiling.... weeeeeee!!!`
    );
  }
  floorNo = parseInt(floorNo);
  console.log(floorNo, typeof floorNo);
  const { room } = req.query;
  console.log(room, typeof room);
  // const { batch, teacherId, slots } = req.body;

  const newClassroom = await Classroom.create({
    floorNo,
    roomNo: room,
    classes: [],
  });

  res.status(201).json({
    status: "success",
    message: "Class created successfully",
    data: newClassroom,
  });
});

export const addClass = catchAsyncError(async (req, res, _) => {
  const { room } = req.query;
  const { batch, teacherId, slots } = req.body;

  //check if the class slot available or not
  const isSlotTaken = await Classroom.aggregate([
    {
      $unwind: "$classes",
    },
    {
      $match: {
        roomNo: room,
        "classes.slots": { $in: slots },
      },
    },
  ]);

  if (isSlotTaken.length > 0) throw new ApiError(400, "Slot full");
  const newData = await Classroom.findOneAndUpdate(
    { roomNo: room },
    {
      $push: {
        classes: {
          batch,
          teacher: teacherId,
          slots,
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

export const createClassSlots = catchAsyncError(async (req, res, _) => {
  const { slot, startTime, endTime } = req.body;
  const newClassSlot = await ClassSlot.create({
    slot,
    startTime,
    endTime,
  });
  res.status(201).json({
    newClassSlot,
  });
});

export const hardwareClassAllocation = catchAsyncError(async (req, res, _) => {
  console.log(req.query);
  res.status(200).send("req reached");
});
