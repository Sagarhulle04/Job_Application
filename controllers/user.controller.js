import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, name, password, role } = req.body;
  const image = req.file.filename;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const url = "http://localhost:3000/uploads/" + image;

    const user = await User.create({
      name,
      email,
      role,
      password: hashPassword,
      photo: url,
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.secretKey,
      { expiresIn: "2h" },
    );

    user = await User.findOne({ email }).select("-password");

    res
      .status(200)
      .json({ success: true, message: "Logged In Successfully", user, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const updateData = { name, email };

    if (req.file) {
      updateData.photo = "http://localhost:3000/uploads/" + req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Logged In User", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recruiterMiddlewareChecking = async (req, res) => {
  res.status(200).json({ message: "Ok Check VS Code Console" });
};
