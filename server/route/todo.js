import express from "express";
import {
  getAllTodos,
  updateTodo,
  deleteTodo,
  getTodo,
  addTodo,
} from "../controllers/todo.js";
import { verifyToken } from "../utils/verify.js";

const router = express.Router();

router.get("/", verifyToken, getAllTodos);

router.get("/:id", verifyToken, getTodo);

router.put("/:id", verifyToken, updateTodo);

router.post("/", verifyToken, addTodo);

router.delete("/:id", verifyToken, deleteTodo);

export default router;
