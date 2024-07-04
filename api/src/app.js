//module imports
import express from "express";
import cookieParser from "cookie-parser";

//cors setup
import corsSetup from "#cors/index.js";

//helper function import
import handleError from "#middlewares/error.middleware.js";
import classroomRouter from "#routes/classroom.routes.js";
import teacherRouter from "#routes/teacher.routes.js";

const app = express();

//first middleware is corsSetup
app.use(corsSetup);

//request parser
app.use(express.json());

//second middleware is cookie parser
app.use(cookieParser());

app.use(`/api/v2/classrooms`, classroomRouter);
app.use(`/api/v2/teachers`, teacherRouter);

app.use(handleError);

export default app;
