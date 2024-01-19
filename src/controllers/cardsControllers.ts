import { Request, Response } from "express";
export async function registerCardInfos(req: Request, res: Response) {
    const cardData=req.body;
    const apiKey=req.query;

    res.sendStatus(201)
  }