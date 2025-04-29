import { connectToDatabase } from "../utils/connect.js";
import Todo from "../controllers/models/todoModels.js";
import { createError } from "./../utils/error.js";
import mongoose from "mongoose";

export async function getAllTodos(req, res, next) {
  try {
    await connectToDatabase();

    const allTodos = await Todo.find({
      userId: new mongoose.Types.ObjectId(req.user.id),
    });
    res.status(200).json(allTodos);
  } catch (err) {
    next(createError(500, "Error getting todos"));
  }
}

export async function getTodo(req, res, next) {
  await connectToDatabase();
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return next(createError(404, "Todo not found"));
  }
  if (todo.userId.toString() !== req.user.id) {
    return next(createError(403, "Unthorized to access"));
  }

  res.status(200).json(todo);
}

export async function updateTodo(req, res, next) {
  await connectToDatabase();
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return next(createError(404, "Todo not found"));
  }

  if (todo.userId.toString() !== req.user.id) {
    return next(createError(403, "Unauthorized to access"));
  }

  const updateTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true }
  );

  res.status(200).json(updateTodo);
}

export async function deleteTodo(req, res, next) {
  await connectToDatabase();

  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) {
    return next(createError(404, "Todo not found"));
  }

  res.status(200).json({ message: "Todo deleted successfully", todo });
}
export async function addTodo(req, res, next) {
  try {
    await connectToDatabase();
    if (!req.body || !req.body.title) {
      return next(createError(404, "title is required"));
    }

    const newTodo = new Todo({
      title: req.body.title,
      userId: req.user.id,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    next(createError(500, "Error saving todo"));
  }
}
