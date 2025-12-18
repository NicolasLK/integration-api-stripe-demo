import { Inject, Injectable } from '@nestjs/common';
import { CreateStripeCustomer } from 'src/shared/utils/stripe';
import type { IUserRepository } from '../repositories/user.repository';
import { UserEntity } from '../user.entity';

interface CreateUserInput {
  name: string;
  email: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    // const userExists = await this.userRepository.findByEmail(input.email);

    // if (userExists) {
    //   throw new Error('Usuário não encontrado');
    // }

    const stripeCustomer = await CreateStripeCustomer({
      email: input.email,
      name: input.name,
    });

    const user = new UserEntity({
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      stripeCustomerId: stripeCustomer.id,
    });

    return this.userRepository.create(user);
  }
}
