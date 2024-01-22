import {
  notFoundError,
  unauthorizedError,
} from "../middlewares/handleErrorsMiddleware.js";
import { findBusinessById } from "../repositories/businessRepository.js";
import { insertPayment } from "../repositories/paymentRepository.js";
import {
  balanceCount,
  checkCardIsActive,
  checkCardIsBlocked,
  checkValidity,
  comparePassword,
  getCardInfos,
  getPayments,
  getRecharge,
} from "./cardService.js";

export async function payment(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  const cardInfos = await getCardInfos(cardId);
  checkCardIsActive(cardInfos);
  checkValidity(cardInfos);
  checkCardIsBlocked(cardInfos);
  comparePassword(password, cardInfos);
  const business = await getBusiness(businessId);
  checkType(business, cardInfos);
  await checkAvailableAmount(cardId, amount);
  await postPaymentInfos(cardId, businessId, amount);
}
async function getBusiness(businessId: number) {
  const business = await findBusinessById(businessId);
  if (business) {
    return business;
  }
  const message = "Business not found";
  throw notFoundError(message);
}
function checkType(business, cardInfos) {
  if (business.type !== cardInfos.type) {
    const message = "This card cannot be used in this type of transaction";
    throw unauthorizedError(message);
  }
}
async function postPaymentInfos(
  cardId: number,
  businessId: number,
  amount: number
) {
  await insertPayment({ cardId, businessId, amount });
}

async function checkAvailableAmount(cardId: number, amount: number) {
  const payments = await getPayments(cardId);
  const recharge = await getRecharge(cardId);
  const balance = balanceCount(recharge, payments);
  const finalBalance = balance - amount;
  if (finalBalance <= -1) {
    const message = "Insufficient funds";
    throw unauthorizedError(message);
  }
}
