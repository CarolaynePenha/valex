import { Request, Response } from "express";
import {
  activation,
  checkToRegisterCard,
  getBalance,
  lock,
  unlock,
} from "../services/cardService.js";

export async function registerCardInfos(req: Request, res: Response) {
  const cardData = req.body;
  const { apiKey } = req.query;
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
export async function unblockingCard(req: Request, res: Response) {
  const card = req.body;
  await unlock(card);
  res.sendStatus(201);
}
