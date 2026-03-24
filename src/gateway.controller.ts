import { Controller, All } from '@nestjs/common';

@Controller()
export class GatewayController {
  @All(['/auth', '/auth/*path', '/products', '/products/*path', '/orders', '/orders/*path'])
  proxy() {}
}
