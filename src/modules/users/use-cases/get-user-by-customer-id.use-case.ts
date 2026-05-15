import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repositories/user.repository';

@Injectable()
export class GetUserByCustomerIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findByCustomerId(id);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return user;
  }
}
