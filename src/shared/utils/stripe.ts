import { envs } from 'src/config/envs.config';
import Stripe from 'stripe';

export const stripe = new Stripe(envs.stripe.secretKey, {
  httpClient: Stripe.createFetchHttpClient(),
});

export const getStripeCustomerByEmail = async (email: string) => {
  const customer = await stripe.customers.list({ email });

  if (!customer) {
    throw new Error('Customer Stripe não encontrado.');
  }

  return customer.data[0];
};

export const createStripeCustomer = async (data: {
  email: string;
  name?: string;
}) => {
  const customer = await getStripeCustomerByEmail(data?.email);

  if (customer) return customer;

  return stripe.customers.create({
    email: data?.email,
    name: data?.name,
  });
};

export const listStripeProducts = async () => {
  const products = await stripe.products.list({
    active: true, // Retorna apenas produtos marcados como ativos no Dashboard
    expand: ['data.default_price'], // Importante para trazer o preço junto com o produto
  });

  return products.data;
};

export const generateCheckout = async (customerId: string, email: string) => {
  try {
    const customer = await createStripeCustomer({
      email,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      client_reference_id: customerId,
      customer: customer.id,
      success_url: `http://localhost:3000/done`,
      cancel_url: `http://localhost:3000/error`,
      line_items: [
        {
          price: process.env.STRIPE_ID_PLAN,
          quantity: 1,
        },
      ],
    });

    return {
      url: session.url,
    };
  } catch (error) {
    console.log('errr', error);
  }
};
