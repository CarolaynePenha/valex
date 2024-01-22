import { Request, Response } from "express";
import { registerEmployeeInfos } from "../services/employeeService.js";
export async function registerEmployee(req: Request, res: Response) {
  const { fullName, cpf, email } = req.body;
  const { apiKey } = req.query;
  await registerEmployeeInfos(apiKey as string, fullName, cpf, email);
  res.sendStatus(201);
}
