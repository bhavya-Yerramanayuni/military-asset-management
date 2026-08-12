import express from "express";

import {
  createExpenditure,
  getExpenditures
} from "../controllers/expenditureController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

import { authorizeRoles } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  getExpenditures
);

router.post(
  "/",
  authenticate,
  authorizeRoles(
  "ADMIN",
  "BASE_COMMANDER"
),
  createExpenditure
);

export default router;