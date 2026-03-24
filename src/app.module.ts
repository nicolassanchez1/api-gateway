import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AuthMiddleware } from './auth.middleware';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [GatewayController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        createProxyMiddleware({
          target: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3002',
          changeOrigin: true,
          pathRewrite: (path, req: Request) => req.originalUrl,
        }),
      )
      .forRoutes('/auth', '/auth/*path');

    consumer
      .apply(
        createProxyMiddleware({
          target: process.env.PRODUCTS_SERVICE_URL || 'http://127.0.0.1:3003',
          changeOrigin: true,
          pathRewrite: (path, req: Request) => req.originalUrl,
        }),
      )
      .forRoutes('/products', '/products/*path');

    consumer
      .apply(
        AuthMiddleware,
        createProxyMiddleware({
          target: process.env.ORDERS_SERVICE_URL || 'http://127.0.0.1:3001',
          changeOrigin: true,
          pathRewrite: (path, req: Request) => req.originalUrl,
        }),
      )
      .forRoutes('/orders', '/orders/*path');
  }
}
