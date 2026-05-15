import { Inject, Injectable, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { envs } from 'src/config/envs.config';
import type { IUserRepository } from 'src/modules/users/repositories/user.repository';
import {
  handleCancelPlan,
  handleCheckoutSessionCompleted,
  handleSubscriptionSessionCompleted,
  createPortalCustomer,
  stripe,
} from 'src/shared/utils/stripe';
import Stripe from 'stripe';
import { USER_REPOSITORY } from '../users/repositories/user.repository';

@Injectable()
export class WebhookService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async handleWebhook(req: RawBodyRequest<Request>, signature: string) {
    const webhookSecret = envs.stripe.webhookSecret;
    let event: Stripe.Event;

    try {
      if (!req.rawBody) {
        throw new Error(
          'rawBody is missing. Ensure rawBody: true is set in main.ts',
        );
      }
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret,
      );
    } catch (err: unknown) {
      throw new Error(`Webhook Error: ${String(err)}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event, this.userRepository);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionSessionCompleted(event, this.userRepository);
        break;

      case 'customer.subscription.deleted':
        await handleCancelPlan(event, this.userRepository);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  async createPortal(idCustomer: string) {
    if (!idCustomer) {
      throw new Error('idCustomer is required');
    }
    return createPortalCustomer(idCustomer);
  }
}
