//module import
import { config } from "dotenv";
config();

//app and helper function import
import app from "#src/app.js";
import connectDB from "#database/index.js";

connectDB()
  .then(() => {
    console.log(`Connected to database.`);
  })
  .catch(error => {
    throw Error(error);
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
