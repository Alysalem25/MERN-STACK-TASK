const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("./user.controller");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create user
router.post("/", createUser);
// Get all users 
router.get("/", authMiddleware, getUsers);
// Get user
router.get("/:id", authMiddleware, getUser);
// Update user
router.patch("/:id", authMiddleware, updateUser);
// Delete user
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router; 