import { Request, Response } from "express";
import { checkCompanyExists, checkCvv } from "../services/cardService.js";
import { unprocessableEntityError } from "../middlewares/handleErrorsMiddleware.js";

export async function registerCardInfos(req: Request, res: Response) {
  const cardData = req.body;
  const { apiKey } = req.query;
  if (!cardData.employeeId || !cardData.type) {
    const message =
      "It is necessary to send the employee's id, and card's type.";
    throw unprocessableEntityError(message);
  }
  await checkCompanyExists(apiKey as string, cardData);
  res.sendStatus(201);
}

export async function updateCardInfos(req: Request, res: Response) {
  const card = req.body;
  await checkCvv(card);
  res.sendStatus(201);
}
