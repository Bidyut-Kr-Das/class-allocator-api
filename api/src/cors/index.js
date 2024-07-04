import cors from "cors";

//process.env.CORS_ORIGIN
// CORS options
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};

export default cors(corsOptions);
