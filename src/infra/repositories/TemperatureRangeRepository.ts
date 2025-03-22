import { Repository } from "typeorm";
import { entityManager } from "../database/DataSource";
import { TemperatureRange } from "../../domain/models";

export class TemperatureRangeRepository extends Repository<TemperatureRange> {}

export default new TemperatureRangeRepository(TemperatureRange, entityManager);

export function makeTemperatureRangeRepository(): TemperatureRangeRepository {
  return new TemperatureRangeRepository(TemperatureRange, entityManager);
}
