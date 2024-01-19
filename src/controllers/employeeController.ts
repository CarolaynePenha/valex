import { Request, Response } from "express";
import { checkCompanyExists } from "../services/employeeService";
export async function registerCardInfos(req: Request, res: Response) {
    const {fullName,cpf,email}=req.body;
    const {apiKey}=req.query
    checkCompanyExists(apiKey,fullName,cpf,email)
    res.sendStatus(201)
  }