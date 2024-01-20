import { Router } from "express";
import cardRouter from "./cardRouter.js";
import employeeRouter from "./employessRouter.js";

const router = Router();
router.use(cardRouter);
router.use(employeeRouter);

export default router;
