import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetUserByCustomerIdUseCase } from './use-cases/get-user-by-customer-id.use-case';
import { GetUsersUseCase } from './use-cases/get-users.use-case';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsers: GetUsersUseCase,
    private readonly getUserByCustomerId: GetUserByCustomerIdUseCase,
  ) {}

  @Post()
  async create(@Body() body: { name: string; email: string }) {
    const newUser = await this.createUserUseCase.execute(body);

    console.log('UsersController: newUser -> ', newUser);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Usuário cadastrado.',
      data: newUser,
    };
  }

  @Get()
  async findAll(@Res() response: Response) {
    const users = await this.getUsers.execute();

    return {
      statusCode: response.status(HttpStatus.OK).json(users),
      message: 'Usuários encontrados',
    };
  }

  @Get(':customerId')
  async findByCustomerId(@Param('customerId') customerId: string) {
    const user = await this.getUserByCustomerId.execute(customerId);

    console.log('UsersController: user -> ', user);

    return {
      statusCode: HttpStatus.OK,
      message: 'Usuário cadastrado.',
      data: user,
    };
  }
}
