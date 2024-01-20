import { Router } from "express";
import {
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

export default cardRouter;
