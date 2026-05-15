import { envs } from 'src/config/envs.config';
import Stripe from 'stripe';
import type { IUserRepository } from 'src/modules/users/repositories/user.repository';

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

/**
 * Lida com a conclusão de uma sessão de checkout do Stripe.
 *
 * Atualiza o usuário no banco de dados com os identificadores do Stripe
 * e ativa a assinatura do mesmo utilizando os métodos de domínio da entidade.
 *
 * @param event Evento do Stripe contendo os dados da sessão
 * @param userRepository Repositório de usuários
 */
export const handleCheckoutSessionCompleted = async (
  event: { data: { object: Stripe.Checkout.Session } },
  userRepository: IUserRepository,
) => {
  const idUser = event.data.object.client_reference_id as string;
  const stripeSubscriptionId = event.data.object.subscription as string;
  const stripeCustumerId = event.data.object.customer as string;
  const checkoutStatus = event.data.object.status;

  if (checkoutStatus !== 'complete') return;

  if (!idUser || !stripeSubscriptionId || !stripeCustumerId) {
    throw new Error(
      'idUser, stripeSubscriptionId, stripeCustumerId is required',
    );
  }

  const userExist = await userRepository.findById(idUser);

  if (!userExist) {
    throw new Error('user not found');
  }

  userExist.linkStripeCustomer(stripeCustumerId);
  userExist.activateSubscription(stripeSubscriptionId);

  await userRepository.update(userExist);
};

/**
 * Lida com as atualizações de assinatura do Stripe.
 *
 * Busca o usuário pelo ID do cliente Stripe e atualiza
 * o status e ID da assinatura utilizando os métodos de domínio.
 *
 * @param event Evento do Stripe contendo os dados da assinatura
 * @param userRepository Repositório de usuários
 */
export const handleSubscriptionSessionCompleted = async (
  event: { data: { object: Stripe.Subscription } },
  userRepository: IUserRepository,
) => {
  const subscriptionStatus = event.data.object.status;
  const stripeCustumerId = event.data.object.customer;
  const stripeSubscriptionId = event.data.object.id;

  const userExist = await userRepository.findByCustomerId(
    stripeCustumerId as string,
  );

  if (!userExist) {
    throw new Error('user stripeCustumerId not found');
  }

  userExist.updateStripeSubscription(stripeSubscriptionId, subscriptionStatus);

  await userRepository.update(userExist);
};

/**
 * Lida com o cancelamento de um plano a partir de um evento do Stripe.
 *
 * Busca o usuário pelo ID do cliente Stripe e cancela a assinatura
 * utilizando os métodos de domínio.
 *
 * @param event Evento do Stripe contendo os dados da assinatura cancelada
 * @param userRepository Repositório de usuários
 */
export const handleCancelPlan = async (
  event: { data: { object: Stripe.Subscription } },
  userRepository: IUserRepository,
) => {
  const stripeCustumerId = event.data.object.customer as string;

  const userExist = await userRepository.findByCustomerId(stripeCustumerId);

  if (!userExist) {
    throw new Error('user stripeCustumerId not found');
  }

  // Utilizando o método de domínio para o cancelamento
  userExist.cancelSubscription();

  await userRepository.update(userExist);
};

/**
 * Solicita o cancelamento de uma assinatura no Stripe.
 *
 * Define a assinatura para ser cancelada no final do período de faturamento atual.
 *
 * @param idSubscriptions ID da assinatura no Stripe
 * @returns Retorna o objeto de assinatura do Stripe atualizado
 */
export const handleCancelSubscription = async (idSubscriptions: string) => {
  const subscription = await stripe.subscriptions.update(idSubscriptions, {
    cancel_at_period_end: true,
  });

  return subscription;
};

/**
 * Cria uma sessão do portal de faturamento (Billing Portal) do Stripe.
 *
 * O portal permite que os clientes gerenciem suas assinaturas e detalhes de faturamento.
 *
 * @param idCustomer ID do cliente no Stripe
 * @returns Objeto de sessão do portal de faturamento do Stripe
 */
export const createPortalCustomer = async (idCustomer: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: idCustomer,
    return_url: 'http://localhost:3000/',
  });

  return session;
};
