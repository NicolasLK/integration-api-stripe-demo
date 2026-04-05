import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetProductsUseCase } from './use-cases/get-products.use-case';

@Controller('products')
export class ProductsController {
  constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      const products = await this.getProductsUseCase.execute();

      return {
        statusCode: HttpStatus.OK,
        data: products,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException('Erro ao recuperar produtos', {
        cause: error,
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
}
