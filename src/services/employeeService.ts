import { notFoundError } from "../middlewares/handleErrorsMiddleware";
import { findByApiKey } from "../repositories/companyRepository";
import employeeRepositories from "../repositories/employeeRepository";

export async function checkCompanyExists(apiKey,fullName,cpf,email) {
    const company= await findByApiKey(apiKey)
    if (company){
    registerEmployeeInfos(fullName,cpf,email,company.id)
    }
    else{
        const message= "Company not found"
        throw notFoundError(message)
    }
  }

  export async function registerEmployeeInfos(fullName,cpf,email,companyId) {
    employeeRepositories.postEmployeeInfos(fullName,cpf,email,companyId)
  }