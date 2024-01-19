import { Router } from "express";
import cardRouter from "./cardRouter";
import employeeRouter from "./employessRouter";

const router = Router();
router.use(cardRouter);
router.use(employeeRouter);

export default router;
