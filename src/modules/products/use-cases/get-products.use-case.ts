/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable } from '@nestjs/common';
import { listStripeProducts } from 'src/shared/utils/stripe';
import { IProductRepository } from '../repositories/product.repository';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute() {
    /**
     * Busca os produtos usando a função utilitária que criamos
     */
    const products = await listStripeProducts();

    return products.map((prod) => {
      // O campo default_price vem como um objeto se você usou o 'expand'
      const price = prod.default_price as any;

      return {
        id: prod.id,
        name: prod.name,
        description: prod.description,
        imageUrl: prod.images[0] || null, // Pega a primeira imagem se houver
        price: {
          id: price?.id,
          amount: (price?.unit_amount || 0) / 100, // Converte centavos para reais
          currency: price?.currency.toUpperCase() || 'BRL',
        },
        active: prod.active,
      };
    });
  }
}
