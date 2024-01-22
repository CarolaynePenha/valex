import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import rechargeSchema from "../schemas/rechargeSchema.js";
import { postRecharge } from "../controllers/rechargeControllers.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge", validateSchema(rechargeSchema), postRecharge);

export default rechargeRouter;
