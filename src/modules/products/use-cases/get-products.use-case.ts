import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../repositories/product.repository';
import { IProductRepository } from '../repositories/product.repository';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute() {
    /**
     * Busca os produtos usando a função utilitária que criamos
     */
    const products = await this.productRepository.findAll();

    if (!products || products.length === 0) {
      throw new NotFoundException('Produtos Stripe não encontrados.');
    }

    /**
     * Filtrando apenas produtos ativos
     * */
    const productsActive = products.filter((prod) => prod.active);

    return productsActive.map((prod) => {
      // O campo default_price vem como um objeto se você usou o 'expand'
      const price = prod.default_price;

      if (typeof price !== 'object' || price === null) {
        throw new Error('Preço inválido ou não definido');
      }

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
