import { ICreateGateway } from 'src/shared/repositories/i-base-repository';
import { UserEntity } from '../user.entity';

export interface IUserRepository extends ICreateGateway<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
}
