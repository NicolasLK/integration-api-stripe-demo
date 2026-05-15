import { ICreateGateway } from 'src/shared/repositories/i-base-repository';
import { UserEntity } from '../user.entity';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository extends ICreateGateway<UserEntity> {
  findByCustomerId(customerId: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[] | null>;
  findById(id: string): Promise<UserEntity | null>;
  update(entity: UserEntity): Promise<UserEntity>;
}
