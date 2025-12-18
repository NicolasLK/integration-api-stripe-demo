import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Get()
  findAll() {
    return {
      message: 'Users endpoint is working',
    };
  }

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
}
