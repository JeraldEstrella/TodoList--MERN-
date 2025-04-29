import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;
  console.log(token);
  if (!token) {
    return next(createError(401, "Not authorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError(403, "Invalid token"));
    }
    req.user = user;
    next();
  });
};
