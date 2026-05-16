import { Module } from '@nestjs/common';
import { CreateCheckoutUseCase } from './use-cases/create-checkout.use-case';
import { CheckoutController } from './checkout.controller';
import { UsersModule } from '../users/users.module';
import { CancelSubscriptionUseCase } from './use-cases/cancel-subscription.use-case';

@Module({
  imports: [UsersModule],
  controllers: [CheckoutController],
  providers: [CreateCheckoutUseCase, CancelSubscriptionUseCase],
  exports: [],
})
export class CheckoutModule {}
