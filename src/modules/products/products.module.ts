import { Module } from '@nestjs/common';
import { TypeormProductRepository } from 'src/infra/database/repositories/typeorm-product.repository';
import { ProductsController } from './products.controller';
import { PRODUCT_REPOSITORY_PROVIDER } from './repositories/product.repository.provider';
import { GetProductsUseCase } from './use-cases/get-products.use-case';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [
    TypeormProductRepository,
    PRODUCT_REPOSITORY_PROVIDER,
    GetProductsUseCase,
  ],
  exports: [PRODUCT_REPOSITORY_PROVIDER, GetProductsUseCase],
})
export class ProductsModule {}
