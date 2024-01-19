import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from "dayjs";

import { conflictError, notFoundError } from "../middlewares/handleErrorsMiddleware";
import { findByTypeAndEmployeeId, insert } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import employeeRepositories from "../repositories/employeeRepository";

export async function checkCompanyExists(apiKey,cardData) {
    const company= await findByApiKey(apiKey)
    if (company){
        isEmployeeOfThisCompany(cardData,company.id)
    }
    else{
        const message= "Company not found"
        throw notFoundError(message)
    }
  }

  export async function isEmployeeOfThisCompany(cardData,companyId) {
    const isEmployee = await employeeRepositories.findById(cardData.employeeId,companyId)
    if (isEmployee){
        firstCardOfThisType(cardData)
    }
    else{
        const message= "Not an employee of this company"
        throw notFoundError(message)
    }
  }

  export async function firstCardOfThisType(cardData) {
    const thisTypeOfCardExist= await findByTypeAndEmployeeId(cardData.type,cardData.employeeId)
    if (!thisTypeOfCardExist){
        registerCard(cardData)
    }
    else{
        const message= "This employee already has a card of this type"
        throw conflictError(message)
    }
  }

  export async function registerCard(cardData) {
    const cryptr = new Cryptr('myTotallySecretKey');
    const randomCardNumber=faker.string.numeric(16)
    const cvv=faker.string.numeric(3)
    const encryptedCvv = cryptr.encrypt(cvv)
    const expirationDate= dayjs().add(1,'month').add(5,"years").format("MM/YY")
    console.log('date: ', expirationDate);
    insert({...cardData,encryptedCvv,randomCardNumber,expirationDate})
  }