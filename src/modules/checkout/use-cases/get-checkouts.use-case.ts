import { Inject, Injectable } from '@nestjs/common';
import { ICheckoutRepository } from '../repositories/checkout.repository';

@Injectable()
export class GetCheckoutsUseCase {
  constructor(
    @Inject('CheckoutRepository')
    private readonly checkoutRepository: ICheckoutRepository,
  ) {}

  async execute() {
    // ...
  }
}
