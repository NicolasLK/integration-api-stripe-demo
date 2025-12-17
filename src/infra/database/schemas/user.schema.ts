import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  // ======================
  // STRIPE
  // ======================

  @Column({
    name: 'stripe_subscription_status',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  stripeSubscriptionStatus?: string;

  @Column({
    name: 'stripe_customer_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  stripeCustomerId?: string;

  @Column({
    name: 'stripe_subscription_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  stripeSubscriptionId?: string;

  // ======================
  // TIMESTAMPS
  // ======================

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
