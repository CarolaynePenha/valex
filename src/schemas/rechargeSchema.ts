import joi from "joi";

const rechargeSchema = joi.object({
  id: joi.number().required(),
  amount: joi.number().integer().min(1).required(),
});

export default rechargeSchema;
