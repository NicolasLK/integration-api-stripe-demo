import { Injectable } from '@nestjs/common';
import { ICheckoutRepository } from 'src/modules/checkout/repositories/checkout.repository';

@Injectable()
export class TypeormCheckoutRepository implements ICheckoutRepository {
  findById?(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<any[] | null> {
    throw new Error('Method not implemented.');
  }
}
