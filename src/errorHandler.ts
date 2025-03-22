import { ErrorRequestHandler, Response } from "express";
import BadRequestError from "./utils/error/bad-request-error";
import ValidationError from "./utils/error/validation-error";
import NotFoundError from "./utils/error/not-found-error";
import { HttpStatusCode } from "./utils/helpers/protocols";

const errorHandler: ErrorRequestHandler = (error, _, res, _next) => {
  console.error(error);

  if (error instanceof NotFoundError) {
    return res.status(HttpStatusCode.NOT_FOUND).json({ message: error.message });
  } else if (error instanceof BadRequestError) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
  } else if (error instanceof ValidationError) {
    return res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({ message: error.message });
  } else {
    return res.status(HttpStatusCode.SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export default errorHandler;
