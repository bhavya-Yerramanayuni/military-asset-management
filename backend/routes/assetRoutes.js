import express from "express";

import {
  getAssets,
  createAsset,
  updateAsset,
} from "../controllers/assetController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

import { authorizeRoles } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  getAssets
);

router.post(
  "/",
  authenticate,
  authorizeRoles(
    "ADMIN",
    "BASE_COMMANDER"
  ),
  createAsset
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles(
    "ADMIN",
    "BASE_COMMANDER"
  ),
  updateAsset
);

export default router;