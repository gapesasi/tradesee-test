import GetStateCapitalsUseCase from "../../../application/usecases/state-capital/GetStateCapitalsUseCase";
import Composer from "../../../domain/abstracts/Composer";
import { makeStateCapitalRepository } from "../../../infra/repositories/StateCapitalRepository";
import DefaultRouter from "../../../utils/helpers/default-router";

export default class GetStateCapitalsComposer implements Composer {
  static compose(): DefaultRouter {
    const useCase = new GetStateCapitalsUseCase(makeStateCapitalRepository());

    return new DefaultRouter(useCase);
  }
}
