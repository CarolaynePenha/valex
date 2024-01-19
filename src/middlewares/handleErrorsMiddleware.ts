import { Request, Response, NextFunction } from "express";

const serviceErrorToStatusCode = {
  unauthorized: 401,
  notFound: 404,
};

export function unauthorizedError() {
  return { type: "unauthorized" };
}

export function notFoundError(message) {
  return { type: "notFound", message };
}

export default function handleErrorsMiddleware(err, req: Request, res:Response, next:NextFunction) {
  console.error(err);
  if (err.type) {
    res.sendStatus(serviceErrorToStatusCode[err.type]);
  }

  res.sendStatus(500);
}
