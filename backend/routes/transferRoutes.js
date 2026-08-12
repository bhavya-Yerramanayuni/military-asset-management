import express from "express";

import {
  createTransfer,
  getTransfers
} from "../controllers/transferController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

import { authorizeRoles } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  getTransfers
);

router.post(
  "/",
  authenticate,
  authorizeRoles(
    "ADMIN",
    "LOGISTICS_OFFICER",
    "BASE_COMMANDER"
  ),
  createTransfer
);

export default router;