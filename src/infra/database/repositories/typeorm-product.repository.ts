import { Injectable } from '@nestjs/common';
import { IProductRepository } from 'src/modules/products/repositories/product.repository';
import { listStripeProducts } from 'src/shared/utils/stripe';

@Injectable()
export class TypeormProductRepository implements IProductRepository {
  async findAll(): Promise<any[] | null> {
    // Busca dados brutos do Stripe utilitário
    const stripeProducts = await listStripeProducts();

    if (!stripeProducts) {
      return null;
    }

    return stripeProducts;
  }
}
