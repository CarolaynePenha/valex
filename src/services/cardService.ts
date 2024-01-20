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

export async function checkCompanyExists(apiKey: string, cardData) {
  const company = await findByApiKey(apiKey);
  if (company) {
    await isEmployeeOfThisCompany(cardData, company.id);
  } else {
    const message = "Company not found";
    throw notFoundError(message);
  }
}

export async function isEmployeeOfThisCompany(cardData, companyId: number) {
  const isEmployee = await employeeRepositories.findById(
    cardData.employeeId,
    companyId
  );
  if (isEmployee) {
    const cardholderName = processName(isEmployee.fullName);
    const cardDataWithcardholderName = { ...cardData, cardholderName };
    await firstCardOfThisType(cardDataWithcardholderName);
  } else {
    const message = "Not an employee of this company";
    throw notFoundError(message);
  }
}

export async function firstCardOfThisType(cardData) {
  const thisTypeOfCardExist = await findByTypeAndEmployeeId(
    cardData.type,
    cardData.employeeId
  );
  if (!thisTypeOfCardExist) {
    await registerCard(cardData);
  } else {
    const message = "This employee already has a card of this type";
    throw conflictError(message);
  }
}

export async function registerCard(cardData) {
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

export function processName(name: string) {
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

export async function checkCvv(card) {
  const cardInfos = await findById(card.id);
  const cryptr = new Cryptr("myTotallySecretKey");
  const securityCode = cryptr.decrypt(cardInfos.securityCode);
  if (!cardInfos) {
    const message = "Card not found";
    throw notFoundError(message);
  }
  if (card.cvv === securityCode) {
    await checkValidity(card, cardInfos);
    return;
  }
  const message = "Invalid security code";
  throw unauthorizedError(message);
}

export async function checkValidity(card, cardInfos) {
  const valid = dayjs(cardInfos.expirationDate).isBefore(dayjs());
  if (!valid) {
    const message = "Expired card";
    throw badRequestError(message);
  }
  await checkCardIsDisabled(card, cardInfos);
}

export async function checkCardIsDisabled(card, cardInfos) {
  if (!cardInfos.password && cardInfos.isBlocked) {
    const passwordHash = bcrypt.hashSync(card.password, 10);
    const cardData = {
      password: passwordHash,
      isBlocked: false,
    };
    activateEmployeeCard(card.id, cardData);
    return;
  }
  const message = "Card already activated";
  throw badRequestError(message);
}

export async function activateEmployeeCard(id, cardData) {
  await update(id, cardData);
}
