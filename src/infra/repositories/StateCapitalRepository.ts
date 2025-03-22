import { Repository } from 'typeorm';
import { StateCapital } from '../../domain/models';
import { entityManager } from '../database/DataSource';


export class StateCapitalRepository extends Repository<StateCapital> {}

export default new StateCapitalRepository(StateCapital, entityManager);

export function makeStateCapitalRepository(): StateCapitalRepository {
  return new StateCapitalRepository(StateCapital, entityManager);
}
