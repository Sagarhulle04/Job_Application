import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Please Re-Login" });
    }

    const user = jwt.verify(token, process.env.secretKey);

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role === "user") {
      next();
    }
    res
      .status(400)
      .json({ success: false, message: "This is the user profile" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recruiterMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.role === "recruiter") {
      res
        .status(400)
        .json({ success: false, message: "This is recruiter dashboard" });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
