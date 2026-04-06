import { envs } from 'src/config/envs.config';
import Stripe from 'stripe';

export const stripe = new Stripe(envs.stripe.secretKey, {
  httpClient: Stripe.createFetchHttpClient(),
});

/**
 * Busca um cliente Stripe pelo email.
 *
 * Caso exista mais de um cliente com o mesmo email,
 * retorna apenas o primeiro encontrado.
 *
 * @param email Email do cliente no Stripe
 * @returns Retorna o cliente Stripe ou `null` caso não exista
 */
export const getStripeCustomerByEmail = async (
  email: string,
): Promise<Stripe.Customer | null> => {
  const customer = await stripe.customers.list({ email, limit: 1 });

  // if (!customer) {
  //   throw new Error('Customer Stripe não encontrado.');
  // }

  return customer.data.length ? customer.data[0] : null;
};

/**
 * Obtém um cliente Stripe existente ou cria um novo caso não exista.
 *
 * A verificação é feita utilizando o email como identificador.
 *
 * @param data Dados do cliente
 * @param data.email Email do cliente
 * @param data.name Nome do cliente (opcional)
 * @returns Retorna o cliente Stripe existente ou recém-criado
 */
export const getOrCreateStripeCustomer = async (data: {
  email: string;
  name?: string;
}): Promise<Stripe.Customer> => {
  const existingCustomer = await getStripeCustomerByEmail(data.email);

  if (existingCustomer) {
    return existingCustomer;
  }

  return stripe.customers.create({
    email: data?.email,
    name: data?.name,
  });
};

/**
 * Lista todos os produtos ativos cadastrados no Stripe.
 *
 * Os produtos retornam com o preço padrão (`default_price`)
 * expandido para facilitar o acesso às informações de cobrança.
 *
 * @returns Lista de produtos ativos do Stripe
 */
export const listStripeProducts = async (): Promise<Stripe.Product[]> => {
  const products = await stripe.products.list({
    active: true, // Retorna apenas produtos marcados como ativos no Dashboard
    expand: ['data.default_price'], // Importante para trazer o preço junto com o produto
  });

  return products.data;
};

/**
 * Gera uma sessão de checkout do Stripe para assinatura.
 *
 * A sessão é vinculada a um cliente Stripe e a um plano
 * previamente configurado no Stripe.
 *
 * @param userId Identificador do cliente/usuário na aplicação
 * @param customerName Nome do cliente
 * @param email Email do cliente
 * @returns Objeto contendo a URL da sessão de checkout
 * @throws Erro caso o cliente Stripe seja inválido ou a sessão não seja criada
 */
export const generateCheckout = async (
  userId: string,
  customerName: string,
  email: string,
): Promise<{ url: string }> => {
  const customer = await getOrCreateStripeCustomer({
    email,
    name: customerName,
  });

  if (!customer.id) {
    throw new Error('Cliente Stripe inválido.');
  }

  if (!envs.stripe.idPrice) {
    throw new Error('STRIPE_ID_PRICE não configurado.');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    client_reference_id: userId,
    customer: customer.id,
    success_url: `http://localhost:3000/done`,
    cancel_url: `http://localhost:3000/error`,
    line_items: [
      {
        price: envs.stripe.idPrice,
        quantity: 1,
      },
    ],
  });

  if (!session.url) {
    throw new Error('Erro ao gerar URL de checkout.');
  }

  return {
    url: session.url,
  };
};
