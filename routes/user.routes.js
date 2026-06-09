import express from "express";
import {
  loggedInUser,
  login,
  recruiterMiddlewareChecking,
  register,
  updateUser,
} from "../controllers/user.controller.js";
import multer from "multer";
import {
  auth,
  recruiterMiddleware,
  userMiddleware,
} from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({ storage });

router.post("/register", upload.single("file"), register);
router.post("/login", login);
router.get("/user", auth, loggedInUser);
router.get(
  "/recruiter",
  auth,
  recruiterMiddleware,
  recruiterMiddlewareChecking,
);
router.put("/updateProfile/:id", auth, upload.single("file"), updateUser);

export default router;
