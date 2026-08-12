import express from "express";

import {
  register,
  login,
} from "../controllers/authController.js";

import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
  "/me",
  authenticate,
  (req, res) => {
    res.json({
      message: "Authentication successful",
      user: req.user,
    });
  }
);

router.get(
  "/admin-test",
  authenticate,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({
      message: "Admin access successful",
      user: req.user,
    });
  }
);

export default router;