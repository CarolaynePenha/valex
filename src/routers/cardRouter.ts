import { Router } from "express";
import {
  cardsBalance,
  registerCardInfos,
  updateCardInfos,
} from "../controllers/cardsControllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import activateSchema from "../schemas/activateSchema.js";

const cardRouter = Router();

cardRouter.post("/registerCard", registerCardInfos);
cardRouter.put(
  "/activateCard",
  validateSchema(activateSchema),
  updateCardInfos
);
cardRouter.get("/cardsBalance/:id", cardsBalance);

export default cardRouter;
