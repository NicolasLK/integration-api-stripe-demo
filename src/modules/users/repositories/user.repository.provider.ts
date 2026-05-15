import { TypeOrmUserRepository } from 'src/infra/database/repositories/typeorm-user.repository';
import { USER_REPOSITORY } from './user.repository';

export const USER_REPOSITORY_PROVIDER = {
  provide: USER_REPOSITORY,
  useExisting: TypeOrmUserRepository,
};
