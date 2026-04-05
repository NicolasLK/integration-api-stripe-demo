import { TypeormCheckoutRepository } from 'src/infra/database/repositories/typeorm-checkout.repository';
import { CHECKOUT_REPOSITORY } from './checkout.repository';

export const CHECKOUT_REPOSITORY_PROVIDER = {
  provide: CHECKOUT_REPOSITORY,
  useExisting: TypeormCheckoutRepository,
};
