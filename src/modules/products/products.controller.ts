import { Controller, Get, HttpStatus } from '@nestjs/common';
import { GetProductsUseCase } from './use-cases/get-products.use-case';

@Controller('products')
export class ProductsController {
  constructor(private readonly GetProductsUseCase: GetProductsUseCase) {}

  @Get()
  async findAll() {
    const products = await this.GetProductsUseCase.execute();

    console.log('ProductsController: products -> ', products);

    return {
      statusCode: HttpStatus.OK,
      data: products,
    };
  }
}
