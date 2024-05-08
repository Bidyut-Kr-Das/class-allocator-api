import catchAsyncError from "#utils/catchAsyncError.js";
import Teacher from "../models/teacher.model.js";
export const getTeachers = catchAsyncError(async (req, res, _) => {
  const teachers = await Teacher.aggregate([
    {
      $project: {
        name: 1,
        _id: 1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: teachers,
  });
});
