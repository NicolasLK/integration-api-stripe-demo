import { TypeOrmUserRepository } from 'src/infra/database/repositories/typeorm-user.repository';

export const USER_REPOSITORY_PROVIDER = {
  provide: 'UserRepository',
  useExisting: TypeOrmUserRepository,
};
