import { Router } from "express";
import { registerCardInfos } from "../controllers/cardsControllers";

const cardRouter=Router()

cardRouter.post("/registerCard",registerCardInfos)

export default cardRouter;