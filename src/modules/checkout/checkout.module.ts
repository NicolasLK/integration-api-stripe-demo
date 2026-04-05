import { Module } from '@nestjs/common';
import { CreateCheckoutUseCase } from './use-cases/create-checkout.use-case';
import { CheckoutController } from './checkout.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [CheckoutController],
  providers: [CreateCheckoutUseCase],
  exports: [],
})
export class CheckoutModule {}
