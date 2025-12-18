import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { envs } from './config/envs.config';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';

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
      synchronize: false, // Nunca usar true em produção
      logging: envs.database.logging,
    }),
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
