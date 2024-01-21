import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from "dayjs";
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
async function checkCompanyExists(apiKey: string) {
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
  const cryptr = new Cryptr("myTotallySecretKey");
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
  await checkCvv(card, cardInfos);
  await checkValidity(cardInfos);
  const cardData = await checkCardIsDisabled(card, cardInfos);
  await activateEmployeeCard(card.id, cardData);
}
async function getCardInfos(id: number) {
  const cardInfos = await findById(id);
  if (!cardInfos) {
    const message = "Card not found";
    throw notFoundError(message);
  }
  return cardInfos;
}
async function checkCvv(card, cardInfos) {
  const cryptr = new Cryptr("myTotallySecretKey");
  const securityCode = cryptr.decrypt(cardInfos.securityCode);
  console.log("securityCode: ", securityCode);
  if (card.cvv === securityCode) {
    return securityCode;
  }
  const message = "Invalid security code";
  throw unauthorizedError(message);
}
async function checkValidity(cardInfos) {
  const valid = dayjs(cardInfos.expirationDate).isBefore(dayjs());
  if (!valid) {
    const message = "Expired card";
    throw badRequestError(message);
  }
}
async function checkCardIsDisabled(card, cardInfos) {
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
async function checkCardIsBlocked(cardInfos) {
  if (cardInfos.isBlocked) {
    const message = "Card already blocked";
    throw badRequestError(message);
  }
}
async function activateEmployeeCard(id: number, cardData) {
  await update(id, cardData);
}

export async function getBalance(id: number) {
  const cardInfos = await getCardInfos(id);
  await checkValidity(cardInfos);
  const payments = await getPayments(id);
  const recharge = await getRecharge(id);
  const balance = balanceCount(recharge, payments);
  const response = constructResponse(balance, recharge, payments);
  return response;
}
async function getPayments(id: number) {
  const paymentsawait = await findByCardId(id);
  return paymentsawait;
}
async function getRecharge(id: number) {
  const recharge = await rechargeRepository.findByCardId(id);
  return recharge;
}
function balanceCount(recharge, payments) {
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
  await checkValidity(cardInfos);
  await checkCardIsBlocked(cardInfos);
  comparePassword(card.password, cardInfos);
  await lockCard(card.id);
}
function comparePassword(password: string, cardInfos) {
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
