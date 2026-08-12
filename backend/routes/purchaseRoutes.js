import express from "express";

import {
  createPurchase,
  getPurchases
} from "../controllers/purchaseController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

import { authorizeRoles } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  getPurchases
);

router.post(
  "/",
  authenticate,
  authorizeRoles(
    "ADMIN",
    "LOGISTICS_OFFICER",
    "BASE_COMMANDER"
  ),
  createPurchase
);

export default router;