import { createError } from "./../utils/error.js";
import { connectToDatabase } from "../utils/connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../controllers/models/userModels.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./server/.env") });
//register controller
export async function register(req, res, next) {
  const data = req.body;

  if (!data?.registerEmail || !data?.registerPassword) {
    return next(createError(400, "Missing fields"));
  }
  await connectToDatabase();
  const allReadyRegistered = await User.exists({
    email: data.registerEmail,
  });
  if (allReadyRegistered) {
    return next(createError(200, "User already registered"));
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data.registerPassword, salt);
  const newUser = new User({
    email: data.registerEmail,
    password: hash,
  });

  try {
    await newUser.save(); // Save user in MongoDB
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(createError(500, "Error saving user"));
  }
}

//login controller
export async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, "Missing fields"));
  }

  await connectToDatabase();

  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    return next(createError(401, "Invalid credentials"));
  }

  const isMatch = await bcrypt.compare(password, currentUser.password);

  if (!isMatch) {
    return next(createError(401, "Invalid credentials"));
  }

  const token = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  console.log(token);
  console.log("Login route!");

  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "User logged" });
}
//register logout
export async function logout(req, res, next) {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "User logged out" });
}
