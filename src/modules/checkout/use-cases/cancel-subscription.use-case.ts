import { Injectable } from '@nestjs/common';
import { handleCancelSubscription } from 'src/shared/utils/stripe';

@Injectable()
export class CancelSubscriptionUseCase {
  constructor() {}

  async execute(subscriptionId: string) {
    if (!subscriptionId) {
      throw new Error('O ID da assinatura é obrigatório.');
    }

    // Chama o utilitário do Stripe que agenda o cancelamento
    const result = await handleCancelSubscription(subscriptionId);

    return result;
  }
}
