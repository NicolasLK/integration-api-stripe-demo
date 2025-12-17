export class UserEntity {
  id: string;
  name: string;

  // Stripe
  stripeSubscriptionStatus?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: {
    id: string;
    name: string;
    stripeSubscriptionStatus?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.stripeSubscriptionStatus = props.stripeSubscriptionStatus;
    this.stripeCustomerId = props.stripeCustomerId;
    this.stripeSubscriptionId = props.stripeSubscriptionId;
  }

  // ======================
  // Domain methods
  // ======================

  activateSubscription(subscriptionId: string): void {
    if (!subscriptionId) {
      throw new Error('SubscriptionId é obrigatório');
    }

    this.stripeSubscriptionStatus = 'active';
    this.stripeSubscriptionId = subscriptionId;
    this.updatedAt = new Date();
  }

  cancelSubscription(): void {
    this.stripeSubscriptionStatus = 'canceled';
    this.updatedAt = new Date();
  }

  linkStripeCustomer(customerId: string): void {
    if (!customerId) {
      throw new Error('CustomerId inválido');
    }

    this.stripeCustomerId = customerId;
    this.updatedAt = new Date();
  }
}
