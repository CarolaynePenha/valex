import { Request, Response, NextFunction } from "express";
export function validateSchema(schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body, { abortEarly: false });
    if (validation.error) {
      return res
        .status(422)
        .send(validation.error.details.map((detail) => detail.message));
    }

    next();
  };
}
