import { IFindAllGateway } from 'src/shared/repositories/i-base-repository';

export interface ICheckoutRepository extends IFindAllGateway<any> {
  findById?(id: string): Promise<any>;
}
