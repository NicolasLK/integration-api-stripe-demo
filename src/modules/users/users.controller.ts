import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetUserByCustomerIdUseCase } from './use-cases/get-user-by-customer-id.use-case';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
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
