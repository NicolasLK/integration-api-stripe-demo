import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'src/modules/users/repositories/user.repository';
import { UserEntity } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { UserSchema } from '../schemas/user.schema';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  async create(postDto: UserEntity): Promise<UserEntity> {
    const ormUser = UserMapper.toOrmSchema(postDto);
    const saved = await this.repository.save(ormUser);

    return UserMapper.toDomainEntity(saved);
  }

  async findByCustomerId(customerId: string): Promise<UserEntity | null> {
    const user = await this.repository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomainEntity(user);
  }

  async findAll(): Promise<UserEntity[] | null> {
    const users = await this.repository.find();

    if (!users) return null;

    return UserMapper.toDomainEntities(users);
  }
}
