import { Request, Response, NextFunction } from "express";

const serviceErrorToStatusCode = {
  unauthorized: 401,
  notFound: 404,
  conflict: 409,
  badRequest: 400,
};

export function unauthorizedError(message) {
  return { type: "unauthorized", message };
}

export function notFoundError(message) {
  return { type: "notFound", message };
}
export function conflictError(message) {
  return { type: "conflict", message };
}
export function badRequestError(message) {
  return { type: "badRequest", message };
}

export default function handleErrorsMiddleware(
  err,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  if (err.type) {
    return res.status(serviceErrorToStatusCode[err.type]).send(err.message);
  }
  return res.status(500).send(err);
}
