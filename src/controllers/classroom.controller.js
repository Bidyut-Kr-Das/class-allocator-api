import catchAsyncError from "#utils/catchAsyncError.js";

export const getClassroomDetails = catchAsyncError(async (req, res, next) => {
  console.log(req.params.floorNo);
  console.log(req.query);
  res.status(200).json({
    status: "success",
    message: "Classroom details fetched successfully",
  });
});
