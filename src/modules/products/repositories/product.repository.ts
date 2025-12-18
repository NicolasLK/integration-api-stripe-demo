import { IFindAllGateway } from 'src/shared/repositories/i-base-repository';

export interface IProductRepository extends IFindAllGateway<any> {
  // ...
  findById?();
}
