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
    [fullName,cpf,email,companyId]
  );
  }

async function findById(id: number) {
  const result = await db.query<Employee, [number]>(
    "SELECT * FROM employees WHERE id=$1",
    [id]
  );

  return result.rows[0];
}

const employeeRepositories={
  postEmployeeInfos,
  findById
}

export default employeeRepositories
