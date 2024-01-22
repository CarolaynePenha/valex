import joi from "joi";

const employeeSchema = joi.object({
  fullName: joi.string().required(),
  cpf: joi.string().min(11).max(11).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

export default employeeSchema;
