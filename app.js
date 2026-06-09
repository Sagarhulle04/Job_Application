import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import main from "./db/index.js";

import userRouter from "./routes/user.routes.js";
import jobRouter from "./routes/job.routes.js";
import appliedJobRouter from "./routes/appliedJob.routes.js";

const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/pdf", express.static("pdf"));
app.use("/appliedJobPdf", express.static("appliedJobPdf"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);
app.use("/", jobRouter);
app.use("/", appliedJobRouter);

main()
  .then(() => {
    console.log("database is connected");
    app.listen(process.env.PORT, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log("database is not connected", err.message);
  });
