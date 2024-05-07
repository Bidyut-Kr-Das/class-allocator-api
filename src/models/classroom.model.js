import { Schema, model } from "mongoose";

const classroomSchema = new Schema(
  {
    roomNo: {
      type: String,
      required: true,
      unique: true,
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
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
          },
          slots: {
            type: [Number],
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
