import { Router, Request, Response } from "express";
import apiRoutes from "./api";

const router = Router();

router.use("/api", apiRoutes);

router.use((req: Request, res: Response) => {
  res.status(404).send("<h1> 404 Error!</h1>");
});

export default router;