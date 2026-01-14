import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from 'src/infra/database/repositories/typeorm-user.repository';
import { UserSchema } from 'src/infra/database/schemas/user.schema';
import { USER_REPOSITORY_PROVIDER } from './repositories/user.repository.provider';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetUserByCustomerIdUseCase } from './use-cases/get-user-by-customer-id.use-case';
import { GetUsersUseCase } from './use-cases/get-users.use-case';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [UsersController],
  providers: [
    TypeOrmUserRepository,
    USER_REPOSITORY_PROVIDER,
    CreateUserUseCase,
    GetUsersUseCase,
    GetUserByCustomerIdUseCase,
  ],
  exports: [
    USER_REPOSITORY_PROVIDER,
    CreateUserUseCase,
    GetUsersUseCase,
    GetUserByCustomerIdUseCase,
  ],
})
export class UsersModule {}
