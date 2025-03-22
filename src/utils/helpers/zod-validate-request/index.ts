import type { RequestHandler } from "express";
import type { ZodError, ZodSchema } from "zod";
import ValidationError from "../../error/validation-error";

type RequestValidation = {
  params?: ZodSchema;
  query?: ZodSchema;
  body?: ZodSchema;
};

const mapErrorMessage = (error: ZodError) => error.errors.map((e) => e.message).join(", ");

export const zodValidateRequest: (schemas: RequestValidation) => RequestHandler =
  ({ params, query, body }) =>
  (req, _res, next) => {
    if (params) {
      const parsed = params.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(mapErrorMessage(parsed.error)));
      }
    }

    if (query) {
      const parsed = query.safeParse(req.query);
      if (!parsed.success) {
        return next(new ValidationError(mapErrorMessage(parsed.error)));
      }
    }

    if (body) {
      const parsed = body.safeParse(req.body);

      if (!parsed.success) {
        return next(new ValidationError(mapErrorMessage(parsed.error)));
      }

      req.body = parsed.data;
    }

    return next();
  };
