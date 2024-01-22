import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import paymentSchema from "../schemas/paymentSchema.js";
import { postPayment } from "../controllers/paymentControllers.js";

const paymentRouter = Router();

paymentRouter.post("/payment", validateSchema(paymentSchema), postPayment);

export default paymentRouter;
