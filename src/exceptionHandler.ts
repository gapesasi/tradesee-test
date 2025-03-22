import BadRequestError from "./utils/error/bad-request-error";
import NotFoundError from "./utils/error/not-found-error";
import ValidationError from "./utils/error/validation-error";
import { HttpResponse, HttpStatusCode } from "./utils/helpers/protocols";

const exceptionHandler = (error: Error): HttpResponse<{ message: string }> => {
  console.error(error);

  let statusCode = HttpStatusCode.SERVER_ERROR;
  const message = error.message || "Internal server error";

  if (error instanceof NotFoundError) {
    statusCode = HttpStatusCode.NOT_FOUND;
  } else if (error instanceof BadRequestError) {
    statusCode = HttpStatusCode.BAD_REQUEST;
  } else if (error instanceof ValidationError) {
    statusCode = HttpStatusCode.UNPROCESSABLE_ENTITY;
  }

  return { statusCode, body: { message } };
};

export default exceptionHandler;
