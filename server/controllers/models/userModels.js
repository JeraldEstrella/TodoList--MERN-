import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Must provide a valid email address"],
    unique: [true, "Must provide a unique valid email address"],
  },
  password: {
    type: String,
    required: [true, "Must provide a password"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
});

const user = mongoose.model("User", userSchema);

export default user;
