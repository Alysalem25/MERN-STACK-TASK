// server/src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");


const userRoutes = require("./users/user.routes");
const authRoutes = require("./auth/auth.routes");
const taskRoutes = require("./tasks/task.routes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(helmet())
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Task Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;