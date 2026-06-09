import express from "express";
import multer from "multer";
import { auth, userMiddleware } from "../middleware/auth.js";
import { appliedJobs, applyJob } from "../controllers/appliedJob.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "appliedJobPdf");
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({ storage });

router.post("/apply/:id", auth, upload.single("file"), applyJob);

router.get("/appliedJob", auth, appliedJobs);

export default router;
