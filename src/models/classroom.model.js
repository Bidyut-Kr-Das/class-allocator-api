import { Schema, model } from "mongoose";

const classroomSchema = new Schema(
  {
    roomNo: {
      type: String,
      unique: true,
    },
    floorNo: {
      type: Number,
    },
    classes: {
      type: [
        {
          batch: {
            type: String,
            default: "Extra class",
          },
          teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
          },
          slots: {
            type: [Number],
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const Classroom = model(`Classroom`, classroomSchema);

export default Classroom;
