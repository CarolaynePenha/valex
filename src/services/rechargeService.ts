import rechargeRepository from "../repositories/rechargeRepository.js";
import {
  checkCardIsActive,
  checkCompanyExists,
  checkValidity,
  getCardInfos,
} from "./cardService.js";

export async function cardRecharge(id: number, amount: number, apiKey: string) {
  await checkCompanyExists(apiKey);
  const cardInfos = await getCardInfos(id);
  checkCardIsActive(cardInfos);
  checkValidity(cardInfos);
  recharge(id, amount);
}

async function recharge(cardId: number, amount: number) {
  await rechargeRepository.insertRecharge({ cardId, amount });
}
