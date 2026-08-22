const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  deleteUser,
  logoutUser,
} = require("./auth.controller");
const {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require("./auth.validator");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// POST /api/auth/register
router.post("/register", validate(registerSchema), registerUser);

// POST /api/auth/login
router.post("/login", validate(loginSchema), loginUser);

// GET /api/auth/profile
router.get("/profile", authMiddleware, getProfile);

// PUT /api/auth/profile
router.put("/profile", authMiddleware, updateProfile);

// PUT /api/auth/change-password
router.put("/change-password", authMiddleware, changePassword);

// DELETE /api/auth/delete
router.delete("/delete", authMiddleware, deleteUser);

// POST /api/auth/logout
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;