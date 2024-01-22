import { Request, Response } from "express";
import { payment } from "../services/paymentService.js";

export async function postPayment(req: Request, res: Response) {
  const { cardId, password, businessId, amount } = req.body;
  await payment(cardId, password, businessId, amount);
  res.sendStatus(201);
}
