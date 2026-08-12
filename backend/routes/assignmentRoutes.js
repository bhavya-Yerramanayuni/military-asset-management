import express from "express";

import {
  createAssignment,
  getAssignments
} from "../controllers/assignmentController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

import { authorizeRoles } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  getAssignments
);

router.post(
  "/",
  authenticate,
  authorizeRoles(
    "ADMIN",
    "BASE_COMMANDER"
  ),
  createAssignment
);

export default router;