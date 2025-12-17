import { Controller, Get } from '@nestjs/common';

@Controller('app-health')
export class AppController {
  @Get()
  checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
