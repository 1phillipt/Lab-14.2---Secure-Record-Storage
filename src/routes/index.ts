import { Router } from "express";
import userRoutes from "./api/userRoutes";
import noteRoutes from "./api/noteRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/notes", noteRoutes);

export default router;