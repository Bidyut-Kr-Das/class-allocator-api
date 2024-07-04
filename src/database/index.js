import mongoose from "mongoose";

import { DBName } from "../constants.js";

const connectDB = async () => {
  const DBUrl = process.env.MONGO_URI.replace(
    `<PASSWORD>`, //make sure names in env are correct and the password part in the uri is same like this
    process.env.MONGO_PASS
  );
  const response = await mongoose.connect(`${DBUrl}/${DBName}`);
};
export default connectDB;
