import { OrganizationTree } from '@/data-contracts/mdviewer/data-contracts';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { OrgTreeApiResponse } from '@/responses/organization.response';
import ApiService from '@/services/api.service';
import authMiddleware from '@middlewares/auth.middleware';
import { Response } from 'express';
import { Controller, Get, Param, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { APIS } from '@config';

@Controller()
export class OrganizationController {
  private apiService = new ApiService();
  private mdviewer = APIS.find(api => api.name === 'mdviewer');

  @Get('/org/:orgId/tree')
  @OpenAPI({
    summary: 'Get organizationtree for organization',
  })
  @ResponseSchema(OrgTreeApiResponse)
  @UseBefore(authMiddleware)
  async getOrgTree(
    @Req() req: RequestWithUser,
    @Param('orgId') orgId: number,
    @Res() response: Response<OrgTreeApiResponse>,
  ): Promise<Response<OrgTreeApiResponse>> {
    const { name } = req.user;

    if (!name) {
      throw new HttpException(400, 'Bad Request');
    }

    try {
      const data = await this.apiService.get<OrganizationTree>({ url: `${this.mdviewer.name}/${this.mdviewer.version}/${orgId}/orgtree` }, req.user);
      return response.send({ data: data.data, message: 'success' });
    } catch (e) {
      throw new HttpException(e?.status || 500, e?.message || 'Internal server error');
    }
  }
}
