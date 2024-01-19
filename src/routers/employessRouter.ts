import { Router } from "express";
import { registerEmployee } from "../controllers/employeeController";

const employeeRouter=Router()

employeeRouter.post("/registerEmployee",registerEmployee)

export default employeeRouter;