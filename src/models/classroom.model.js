import { Schema, model } from "mongoose";

const classroomSchema = new Schema(
  {
    roomNo: {
      type: String,
      required: true,
      // unique: true,
    },
    floorNo: {
      type: Number,
      required: true,
    },
    classes: {
      type: [
        {
          batch: {
            type: String,
            required: true,
            default: "Extra class",
          },
          teacher: {
            type: String,
            required: true,
          },
          startTime: {
            type: Date,
            required: true,
          },
          endTime: {
            type: Date,
            required: true,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const Classroom = model(`Classroom`, classroomSchema);

export default Classroom;
