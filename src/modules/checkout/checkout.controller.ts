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
import { CancelSubscriptionUseCase } from './use-cases/cancel-subscription.use-case';

@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly createCheckoutUseCase: CreateCheckoutUseCase,
    private readonly getUserByCustomerId: GetUserByCustomerIdUseCase,
    private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCase,
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

  @Post('cancel/:subscriptionId')
  @HttpCode(HttpStatus.OK)
  async cancelSubscription(@Param('subscriptionId') subscriptionId: string) {
    try {
      const result =
        await this.cancelSubscriptionUseCase.execute(subscriptionId);

      return {
        statusCode: HttpStatus.OK,
        message: 'Cancelamento da assinatura agendado para o fim do ciclo.',
        data: result,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException('Erro ao cancelar assinatura', {
        cause: error,
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
}
