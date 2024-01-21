import joi from "joi";

const cardblockingSchema = joi.object({
  id: joi.number().required(),
  password: joi
    .string()
    .pattern(/^\d{4}$/)
    .required(),
});

export default cardblockingSchema;
