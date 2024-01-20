import joi from "joi";

const activateSchema = joi.object({
  id: joi.number().required(),
  password: joi
    .string()
    .pattern(/^\d{4}$/)
    .required(),
  cvv: joi
    .string()
    .pattern(/^\d{3}$/)
    .required(),
});

export default activateSchema;
