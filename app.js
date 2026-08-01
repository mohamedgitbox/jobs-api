require("dotenv").config();
require("express-async-errors");

// extra security package
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const  rateLimit  = require("express-rate-limit")


const express = require("express");
const app = express();

// middlewares
const connectDB = require("./db/connect");
const authenticationUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth.routes");
const jobsRouter = require("./routes/jobs.routes");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
  }),
);
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticationUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
    await connectDB(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
};

start();
