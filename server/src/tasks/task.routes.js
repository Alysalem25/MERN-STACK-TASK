const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTasksGroupedByStatus,
  changeStatus,
  updateTask,
  getTasksWithPagination
} = require("./task.controller");
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.get("/getPagination/:id", getTasksWithPagination);
router.get("/tasks/:id/grouped", authMiddleware, getTasksGroupedByStatus);
router.patch("/:id", changeStatus);
router.patch("/edit/:id",authMiddleware, updateTask);

module.exports = router;
