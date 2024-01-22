import { notFoundError } from "../middlewares/handleErrorsMiddleware.js";
import employeeRepositories from "../repositories/employeeRepository.js";
import { checkCompanyExists } from "./cardService.js";

export async function registerEmployeeInfos(
  apiKey: string,
  fullName: string,
  cpf: string,
  email: string
) {
  const company = await checkCompanyExists(apiKey);
  if (!company) {
    const message = "Company not found";
    throw notFoundError(message);
  } else {
    await postEmployee(fullName, cpf, email, company.id);
  }
}

export async function postEmployee(
  fullName: string,
  cpf: string,
  email: string,
  companyId: number
) {
  await employeeRepositories.postEmployeeInfos(fullName, cpf, email, companyId);
}
