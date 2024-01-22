import { Request, Response } from "express";
import { cardRecharge } from "../services/rechargeService.js";

export async function postRecharge(req: Request, res: Response) {
  const { id, amount } = req.body;
  const { apiKey } = req.query;
  await cardRecharge(id, amount, apiKey as string);
  res.sendStatus(201);
}
