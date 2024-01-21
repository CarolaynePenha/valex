import { Request, Response } from "express";
import {
  activation,
  checkToRegisterCard,
  getBalance,
  lock,
} from "../services/cardService.js";
import { unprocessableEntityError } from "../middlewares/handleErrorsMiddleware.js";

export async function registerCardInfos(req: Request, res: Response) {
  const cardData = req.body;
  const { apiKey } = req.query;
  if (!cardData.employeeId || !cardData.type) {
    const message =
      "It is necessary to send the employee's id, and card's type.";
    throw unprocessableEntityError(message);
  }
  await checkToRegisterCard(apiKey as string, cardData);
  res.sendStatus(201);
}

export async function updateCardInfos(req: Request, res: Response) {
  const card = req.body;
  await activation(card);
  res.sendStatus(201);
}

export async function cardsBalance(req: Request, res: Response) {
  const { id } = req.params;
  const response = await getBalance(Number(id));
  res.status(200).send(response);
}

export async function blockingCard(req: Request, res: Response) {
  const card = req.body;
  await lock(card);
  res.sendStatus(201);
}
