import { Router } from "express";
import cardRouter from "./cardRouter.js";
import employeeRouter from "./employessRouter.js";
import rechargeRouter from "./rechargeRouters.js";
import paymentRouter from "./paymentRouter.js";

const router = Router();
router.use(cardRouter);
router.use(employeeRouter);
router.use(rechargeRouter);
router.use(paymentRouter);

export default router;
