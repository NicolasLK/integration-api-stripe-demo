import { TypeormProductRepository } from 'src/infra/database/repositories/typeorm-product.repository';
import { PRODUCT_REPOSITORY } from './product.repository';

export const PRODUCT_REPOSITORY_PROVIDER = {
  provide: PRODUCT_REPOSITORY,
  useExisting: TypeormProductRepository,
};
