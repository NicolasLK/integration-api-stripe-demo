import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    try {
      return await this.webhookService.handleWebhook(req, signature);
    } catch (error: unknown) {
      throw new BadRequestException(String(error));
    }
  }

  @Post('portal')
  async createPortal(@Body('idCustomer') idCustomer: string) {
    if (!idCustomer) {
      throw new BadRequestException('idCustomer is required');
    }

    try {
      return await this.webhookService.createPortal(idCustomer);
    } catch (error: unknown) {
      throw new BadRequestException(String(error));
    }
  }
}
