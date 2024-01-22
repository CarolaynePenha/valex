import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);
import bcrypt from "bcrypt";

import {
  badRequestError,
  conflictError,
  notFoundError,
  unauthorizedError,
} from "../middlewares/handleErrorsMiddleware.js";
import {
  findById,
  findByTypeAndEmployeeId,
  insert,
  update,
} from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import employeeRepositories from "../repositories/employeeRepository.js";
import { findByCardId } from "../repositories/paymentRepository.js";
import rechargeRepository from "../repositories/rechargeRepository.js";

export async function checkToRegisterCard(apiKey: string, cardData) {
  const company = await checkCompanyExists(apiKey);
  const companyId = company.id;
  const isEmployee = await isEmployeeOfThisCompany(cardData, companyId);
  const cardholderName = processName(isEmployee.fullName);
  const cardDataWithcardholderName = { ...cardData, cardholderName };
  await firstCardOfThisType(cardDataWithcardholderName);
  await registerCard(cardDataWithcardholderName);
}
export async function checkCompanyExists(apiKey: string) {
  const company = await findByApiKey(apiKey);
  if (company) {
    return company;
  } else {
    const message = "Company not found";
    throw notFoundError(message);
  }
}
async function isEmployeeOfThisCompany(cardData, companyId: number) {
  const isEmployee = await employeeRepositories.findById(
    cardData.employeeId,
    companyId
  );
  if (isEmployee) {
    return isEmployee;
  } else {
    const message = "Not an employee of this company";
    throw notFoundError(message);
  }
}
async function firstCardOfThisType(cardData) {
  const thisTypeOfCardExist = await findByTypeAndEmployeeId(
    cardData.type,
    cardData.employeeId
  );
  if (thisTypeOfCardExist) {
    const message = "This employee already has a card of this type";
    throw conflictError(message);
  }
}
async function registerCard(cardData) {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
  const number = faker.string.numeric(16);
  const cvv = faker.string.numeric(3);
  const securityCode = cryptr.encrypt(cvv);
  const expirationDate = dayjs()
    .add(1, "month")
    .add(5, "years")
    .format("MM/YY");
  insert({ ...cardData, securityCode, number, expirationDate });
}
function processName(name: string) {
  const part = name.split(" ");
  let result = part[0];

  for (let i = 1; i < part.length - 1; i++) {
    if (part[i].length > 2) {
      result += " " + part[i][0];
    }
  }
  const lastName = part[part.length - 1];
  result += " " + lastName;

  return result;
}

export async function activation(card) {
  const cardInfos = await getCardInfos(card.id);
  checkCvv(card, cardInfos);
  checkValidity(cardInfos);
  const cardData = checkCardIsDisabled(card, cardInfos);
  await activateEmployeeCard(card.id, cardData);
}
export async function getCardInfos(id: number) {
  const cardInfos = await findById(id);
  if (!cardInfos) {
    const message = "Card not found";
    throw notFoundError(message);
  }
  return cardInfos;
}
function checkCvv(card, cardInfos) {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
  const securityCode = cryptr.decrypt(cardInfos.securityCode);
  console.log("securityCode: ", securityCode);
  if (card.cvv === securityCode) {
    return securityCode;
  }
  const message = "Invalid security code";
  throw unauthorizedError(message);
}
export function checkValidity(cardInfos) {
  const date = dayjs();
  const expirationDate = dayjs(cardInfos.expirationDate, "MM/YY");
  const valid = expirationDate.isAfter(date);
  if (!valid) {
    const message = "Expired card";
    throw badRequestError(message);
  }
}
function checkCardIsDisabled(card, cardInfos) {
  if (!cardInfos.password && cardInfos.isBlocked) {
    const passwordHash = bcrypt.hashSync(card.password, 10);
    const cardData = {
      password: passwordHash,
      isBlocked: false,
    };
    return cardData;
  }
  const message = "Card already activated";
  throw badRequestError(message);
}
export function checkCardIsBlocked(cardInfos) {
  if (cardInfos.isBlocked) {
    const message = "Card is blocked";
    throw badRequestError(message);
  }
}
function checkCardIsUnblocked(cardInfos) {
  if (!cardInfos.isBlocked) {
    const message = "Card already unblocked";
    throw badRequestError(message);
  }
}
export function checkCardIsActive(cardInfos) {
  if (!cardInfos.password) {
    const message = "Deactivated card";
    throw badRequestError(message);
  }
}
async function activateEmployeeCard(id: number, cardData) {
  await update(id, cardData);
}

export async function getBalance(id: number) {
  const cardInfos = await getCardInfos(id);
  checkValidity(cardInfos);
  const payments = await getPayments(id);
  const recharge = await getRecharge(id);
  const balance = balanceCount(recharge, payments);
  const response = constructResponse(balance, recharge, payments);
  return response;
}
export async function getPayments(id: number) {
  const payments = await findByCardId(id);
  return payments;
}
export async function getRecharge(id: number) {
  const recharge = await rechargeRepository.findByCardId(id);
  return recharge;
}
export function balanceCount(recharge, payments) {
  const initialValue = 0;
  const totalRecharge = recharge.reduce(
    (sum: number, currentValue) => sum + currentValue.amount,
    initialValue
  );
  const totalpayments = payments.reduce(
    (sum: number, currentValue) => sum + currentValue.amount,
    initialValue
  );
  const balance = totalRecharge - totalpayments;
  return balance;
}
function constructResponse(balance: number, recharge, payments) {
  const response = {
    balance,
    transactions: payments,
    recharges: recharge,
  };
  return response;
}

export async function lock(card) {
  const cardInfos = await getCardInfos(card.id);
  checkValidity(cardInfos);
  checkCardIsBlocked(cardInfos);
  comparePassword(card.password, cardInfos);
  await lockCard(card.id);
}
export function comparePassword(password: string, cardInfos) {
  const compare = bcrypt.compareSync(password, cardInfos.password);
  if (!compare) {
    const message = "Incorrect information";
    throw unauthorizedError(message);
  }
}
async function lockCard(id: number) {
  const cardData = {
    isBlocked: true,
  };
  await update(id, cardData);
}
export async function unlock(card) {
  const cardInfos = await getCardInfos(card.id);
  checkValidity(cardInfos);
  checkCardIsActive(cardInfos);
  checkCardIsUnblocked(cardInfos);
  comparePassword(card.password, cardInfos);
  await unlockCard(card.id);
}
async function unlockCard(id: number) {
  const cardData = {
    isBlocked: false,
  };
  await update(id, cardData);
}
