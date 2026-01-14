import { TypeormCheckoutRepository } from 'src/infra/database/repositories/typeorm-checkout.repository';

export const CHECKOUT_REPOSITORY_PROVIDER = {
  provide: 'CheckoutRepository',
  useExisting: TypeormCheckoutRepository,
};
