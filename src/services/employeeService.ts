import { notFoundError } from "../middlewares/handleErrorsMiddleware.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import employeeRepositories from "../repositories/employeeRepository.js";

export async function checkCompanyExists(apiKey:string,fullName:string,cpf:string,email:string) {
    const company= await findByApiKey(apiKey)
    if (company){
      await registerEmployeeInfos(fullName,cpf,email,company.id)
    }
    else{
        const message= "Company not found"
        throw notFoundError(message)
    }
  }

  export async function registerEmployeeInfos(fullName:string,cpf:string,email:string,companyId:number) {
    await employeeRepositories.postEmployeeInfos(fullName,cpf,email,companyId)
  }