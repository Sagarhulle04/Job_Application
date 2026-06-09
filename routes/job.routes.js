import express from "express";
import {
  auth,
  recruiterMiddleware,
  userMiddleware,
} from "../middleware/auth.js";
import {
  allJobList,
  createJob,
  deleteJobPost,
  jobPostedByMe,
  updateJobPost,
} from "../controllers/jobs.controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "pdf/");
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({ storage });

router.post("/createJob", auth, upload.single("file"), createJob);

router.get("/allJobList", auth, allJobList);
router.put("/updatePost", auth, recruiterMiddleware, updateJobPost);
router.delete("/deletePost/:id", auth, recruiterMiddleware, deleteJobPost);
router.get("/jobPostedByMe", auth, jobPostedByMe);

export default router;
