import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { envs } from './config/envs.config';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { WebhookModule } from './modules/webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envs.database.host,
      port: Number(envs.database.port),
      username: envs.database.username,
      password: envs.database.password,
      database: envs.database.name,
      autoLoadEntities: true,
      synchronize: true, // Nunca usar true em produção
      logging: envs.database.logging,
    }),
    UsersModule,
    ProductsModule,
    CheckoutModule,
    WebhookModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
