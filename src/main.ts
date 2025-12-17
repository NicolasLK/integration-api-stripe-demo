import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não listadas no DTO
      forbidNonWhitelisted: true, // Lança erro se vier algo não permitido
      transform: true, // Transforma os dados pro tipo definido (ex: string => number)
    }),
  );

  await app.listen(envs.app.port);

  console.log('Rodando aplicação na porta -> ', envs.app.port);
}
bootstrap().catch((err) => {
  console.error('Erro ao iniciar a aplicação:', err);
});
