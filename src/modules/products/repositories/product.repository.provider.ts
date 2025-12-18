import { TypeormProductRepository } from 'src/infra/database/repositories/typeorm-product.repository';

export const PRODUCT_REPOSITORY_PROVIDER = {
  provide: 'ProductRepository',
  useExisting: TypeormProductRepository,
};
