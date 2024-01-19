import { Request, Response } from "express";
import { checkCompanyExists } from "../services/cardService.js";

export async function registerCardInfos(req: Request, res: Response) {
    const cardData=req.body;
    const apiKey=req.query;
    checkCompanyExists(cardData,apiKey)
    res.sendStatus(201)
  }