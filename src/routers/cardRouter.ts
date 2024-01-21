import { Router } from "express";
import {
  cardsBalance,
  registerCardInfos,
  blockingCard,
  updateCardInfos,
} from "../controllers/cardsControllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import activateSchema from "../schemas/activateSchema.js";
import cardblockingSchema from "../schemas/cardblockingSchema.js";

const cardRouter = Router();

cardRouter.post("/registerCard", registerCardInfos);
cardRouter.put(
  "/activateCard",
  validateSchema(activateSchema),
  updateCardInfos
);
cardRouter.get("/cardsBalance/:id", cardsBalance);
cardRouter.put(
  "/cardBlocking",
  validateSchema(cardblockingSchema),
  blockingCard
);

export default cardRouter;
