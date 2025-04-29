import express from "express";
import AuthRoute from "./route/auth.js";
import TodoRoute from "./route/todo.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({ path: path.resolve("./server/.env") });

const app = express();
const PORT = 3000;

dotenv.config();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5175",
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parser and cookie parser
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
app.use("/api/user", AuthRoute);
app.use("/api/todos", TodoRoute);

// Test route to check if server is working
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
