import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateCheckoutUseCase } from './use-cases/create-checkout.use-case';
import { GetUserByCustomerIdUseCase } from '../users/use-cases/get-user-by-customer-id.use-case';

@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly createCheckoutUseCase: CreateCheckoutUseCase,
    private readonly getUserByCustomerId: GetUserByCustomerIdUseCase,
  ) {}

  @Post(':customerId')
  @HttpCode(HttpStatus.OK)
  async create(@Param('customerId') customerId: string) {
    try {
      const user = await this.getUserByCustomerId.execute(customerId);

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const checkout = await this.createCheckoutUseCase.execute({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      return {
        statusCode: HttpStatus.OK,
        data: checkout,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException('Erro ao criar checkout', {
        cause: error,
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
}
