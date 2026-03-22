import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(
    '/products',
    createProxyMiddleware({
      target: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3000',
      changeOrigin: true,
    }),
  );

  app.use(
    '/orders',
    createProxyMiddleware({
      target: process.env.ORDERS_SERVICE_URL || 'http://localhost:3001',
      changeOrigin: true,
    }),
  );

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`API Gateway is running on port: ${port}`);
}

void bootstrap();
