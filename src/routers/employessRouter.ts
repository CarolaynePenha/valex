import { Router } from "express";
import { registerEmployee } from "../controllers/employeeController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import employeeSchema from "../schemas/employeeSchema.js";

const employeeRouter = Router();

employeeRouter.post(
  "/registerEmployee",
  validateSchema(employeeSchema),
  registerEmployee
);

export default employeeRouter;
