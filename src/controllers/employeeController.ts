import { Request, Response } from "express";
import { checkCompanyExists } from "../services/employeeService.js";
import { unprocessableEntityError } from "../middlewares/handleErrorsMiddleware.js";
export async function registerEmployee(req: Request, res: Response) {
    const {fullName,cpf,email}=req.body;
    const {apiKey}=req.query
    if(!fullName||!cpf||!email){
      const message = "It is necessary to send the employee's full name, CPF and email"
      throw unprocessableEntityError(message)
    }
    await checkCompanyExists(apiKey as string,fullName,cpf,email)
    res.sendStatus(201)
  }