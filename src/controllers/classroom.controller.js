import ApiError from "#utils/apiError.js";

import catchAsyncError from "#utils/catchAsyncError.js";
import Classroom from "../models/classroom.model.js";
import ClassSlot from "../models/classSlots.model.js";
import Teacher from "../models/teacher.model.js";

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
        "classes.slots": 1,
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

export const getClassStartTime = catchAsyncError(async (req, res, _) => {
  const classSlots = await ClassSlot.aggregate([
    {
      $group: {
        _id: "null",
        startTime: { $push: "$startTime" },
      },
    },
  ]);
  res.status(200).json({
    status: "Success",
    message: "Class start time fetched successfully",
    startTime: classSlots[0].startTime,
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
  //{ slot: '2', class: '1', card: '163138252253' }
  console.log(req.query);

  const { slot, classspan, card, room } = req.query;

  const { _id } = await Teacher.findOne({
    card,
  });

  console.log(_id);

  //calculate the slot array
  const slotArray = [];

  if (classspan === "1") slotArray.push(parseInt(slot));
  else {
    if (slot === "9") slotArray.push(9);
    else {
      slotArray.push(parseInt(slot));
      slotArray.push(parseInt(slot) + 1);
    }
  }

  // console.log(slotArray);

  const isSlotTaken = await Classroom.aggregate([
    {
      $unwind: "$classes",
    },
    {
      $match: {
        roomNo: room,
        "classes.slots": { $in: slotArray },
      },
    },
  ]);

  if (isSlotTaken.length > 0) return res.status(400).send("Slot full       ");

  const newData = await Classroom.findOneAndUpdate(
    { roomNo: room },
    {
      $push: {
        classes: {
          teacher: _id,
          slots: slotArray,
        },
      },
    },
    { new: true }
  );

  res.status(200).send("Class Booked.   ");
});
