import db from "../config/db.js";

export interface Employee {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  companyId: number;
}
async function postEmployeeInfos(fullName:string,cpf:string,email:string,companyId:number) {
    return await db.query<Employee>(
    `INSERT INTO employees ("fullName",cpf,email,"companyId")
    VALUES($1,$2,$3,$4)`,
    [fullName.toUpperCase(),cpf,email.toLowerCase(),companyId]
  );
  }

async function findById(id: number,companyId: number) {
  const result = await db.query<Employee>(
    `SELECT * FROM employees WHERE id=$1
    AND "companyId"=$2`,
    [id,companyId]
  );

  return result.rows[0];
}

const employeeRepositories={
  postEmployeeInfos,
  findById
}

export default employeeRepositories
