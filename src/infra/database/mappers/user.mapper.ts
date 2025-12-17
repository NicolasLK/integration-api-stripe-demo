import { UserEntity } from 'src/modules/users/user.entity';
import { UserSchema } from '../schemas/user.schema';

export class UserMapper {
  /**
   * Schema ORM --> Entidade de domínio
   * @param UserSchema
   * @returns UserEntity
   */
  static toDomainEntity(schema: UserSchema): UserEntity {
    return new UserEntity({
      id: schema.id,
      name: schema.name,
      stripeSubscriptionStatus: schema.stripeSubscriptionStatus,
      stripeCustomerId: schema.stripeCustomerId,
      stripeSubscriptionId: schema.stripeSubscriptionId,
    });
  }

  /**
   * Entidade de domínio --> Schema ORM (persistência)
   * @param UserEntity
   * @returns UserSchema
   */
  static toOrmSchema(entity: UserEntity): UserSchema {
    const schema = new UserSchema();

    schema.id = entity.id;
    schema.name = entity.name;
    schema.stripeSubscriptionStatus = entity.stripeSubscriptionStatus;
    schema.stripeCustomerId = entity.stripeCustomerId;
    schema.stripeSubscriptionId = entity.stripeSubscriptionId;

    return schema;
  }

  /**
   * Lista de schemas ORM --> Lista de entidades de domínio
   * @param UserSchema[]
   * @returns UserEntity
   */
  static toDomainEntities(ormUsers: UserSchema[]): UserEntity[] {
    return ormUsers.map((ormUser) => this.toDomainEntity(ormUser));
  }
}
