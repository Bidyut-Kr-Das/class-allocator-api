import { model, Schema } from "mongoose";

const teacherSchema = new Schema(
  {
    name: {
      type: string,
      required: true,
    },
    email: {
      type: string,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = model(`Teacher`, teacherSchema);

export default Teacher;
