import joi from "joi";

const paymentSchema = joi.object({
  cardId: joi.number().integer().required(),
  password: joi
    .string()
    .pattern(/^\d{4}$/)
    .required(),
  businessId: joi.number().integer().required(),
  amount: joi.number().integer().min(1),
});

export default paymentSchema;
