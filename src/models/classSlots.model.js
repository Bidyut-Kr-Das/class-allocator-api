import { Schema, model } from "mongoose";

const classSlotSchema = new Schema({
  slot: {
    type: String,
    required: true,
    unique: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const ClassSlot = model("ClassSlot", classSlotSchema);
export default ClassSlot;
