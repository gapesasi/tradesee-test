import { Request } from "express";
import exceptionHandler from "../../../exceptionHandler";
import { HttpStatusCode } from "../protocols";

interface HttpResponse {
  statusCode: HttpStatusCode;
  body: any;
}

interface UseCase {
  execute: (request: any) => Promise<HttpResponse | any>;
}

export default class DefaultRouter {
  private useCase: UseCase;

  constructor(useCase: UseCase) {
    this.useCase = useCase;
  }

  async route(httpRequest: Request): Promise<HttpResponse> {
    try {
      const defaultResult: HttpResponse = await this.useCase.execute(httpRequest);

      return defaultResult;
    } catch (err) {
      const error = err as Error;

      return exceptionHandler(error);
    }
  }
}
