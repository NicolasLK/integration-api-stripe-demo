import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repositories/user.repository';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute() {
    const users = await this.userRepository.findAll();

    if (users === null) {
      throw new Error('Usuários não encontrados.');
    }

    return users;
  }
}
