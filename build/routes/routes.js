import express from "express";
import adminRoutes from "./AdminRoutes.js";
import userRoutes from "./UserRoutes.js";
const router = express.Router();
router.use("/", adminRoutes);
router.use("/", userRoutes);
export default router;
