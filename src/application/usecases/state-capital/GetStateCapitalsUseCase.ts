import UseCase from "../../../domain/interfaces/UseCase";
import { StateCapital } from "../../../domain/models";
import { StateCapitalRepository } from "../../../infra/repositories/StateCapitalRepository";
import { HttpResponse, HttpStatusCode } from "../../../utils/helpers/protocols";

export default class GetStateCapitalsUseCase implements UseCase<StateCapital[]> {
  constructor(private readonly stateCapitalRepository: StateCapitalRepository) {}

  async execute(): Promise<HttpResponse<StateCapital[]>> {
    const stateCapitals = await this.stateCapitalRepository.find();

    return { statusCode: HttpStatusCode.OK, body: stateCapitals };
  }
}
