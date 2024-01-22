import joi from "joi";

const registerCardSchema = joi.object({
  employeeId: joi.number().required(),
  type: joi
    .string()
    .valid("groceries", "restaurant", "transport", "education", "health"),
});

export default registerCardSchema;
