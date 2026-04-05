import { IFindAllGateway } from 'src/shared/repositories/i-base-repository';
import Stripe from 'stripe';

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');

export interface IProductRepository extends IFindAllGateway<Stripe.Product> {
  findById?(id: string): Promise<Stripe.Product | null>;
}
