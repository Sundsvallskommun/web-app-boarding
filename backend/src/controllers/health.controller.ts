import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { Controller, Get, Req } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { APIS } from '@config';
import { RequestWithUser } from '@/interfaces/auth.interface';

@Controller()
export class HealthController {
  private apiService = new ApiService();
  public api = APIS.find(x => x.name === 'simulatorserver');

  @Get('/health/up')
  @OpenAPI({ summary: 'Return health check' })
  async up(@Req() req: RequestWithUser) {
    const url = `${this.api.name}/${this.api.version}/simulations/response?status=200%20OK`;
    const data = {
      status: 'OK',
    };
    const res = await this.apiService.post<{ status: string }, any>({ url, data }, req.user).catch(e => {
      logger.error('Error when doing health check:', e);
      return e;
    });

    return res.data;
  }
}
