import express from "express";
const router = express.Router();
import PlinkoGameController from "../controller/PlinkoGameController.js";
import { varifyToken, varifyTokenOptional } from "../helper/jwtVarifyHelper.js";

// insert plinko game API
router.post(
  "/insertPlinkoBet",
  varifyToken,
  PlinkoGameController.insertPlinkoBet
);
// API for inserting bet result
router.post(
  "/betResultPlinko",
  varifyToken,
  PlinkoGameController.betResultPlinko
);

export default router;
