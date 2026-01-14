import { ICreateGateway } from 'src/shared/repositories/i-base-repository';
import { UserEntity } from '../user.entity';

export interface IUserRepository extends ICreateGateway<UserEntity> {
  findByCustomerId(customerId: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[] | null>;
}
