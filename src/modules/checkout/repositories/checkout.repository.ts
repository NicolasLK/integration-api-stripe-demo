import { IFindAllGateway } from 'src/shared/repositories/i-base-repository';

export const CHECKOUT_REPOSITORY = Symbol('ICheckoutRepository');

export interface ICheckoutRepository extends IFindAllGateway<any> {
  findById?(id: string): Promise<any>;
}
