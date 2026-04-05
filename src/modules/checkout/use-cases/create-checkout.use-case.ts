import { Injectable } from '@nestjs/common';
import { generateCheckout } from 'src/shared/utils/stripe';

@Injectable()
export class CreateCheckoutUseCase {
  constructor() {}

  async execute(user: { id: string; name: string; email: string }) {
    const checkout = await generateCheckout(user.id, user.name, user.email);

    return checkout;
  }
}
