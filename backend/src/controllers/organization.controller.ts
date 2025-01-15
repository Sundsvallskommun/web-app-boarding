import { OrganizationTree } from '@/data-contracts/mdviewer/data-contracts';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Organization } from '@/responses/checklist.response';
import { OrganizationsApiResponse, OrgTemplateApiResponse, OrgTreeApiResponse } from '@/responses/organization.response';
import ApiService from '@/services/api.service';
import { APIS, MUNICIPALITY_ID } from '@config';
import authMiddleware from '@middlewares/auth.middleware';
import { Response } from 'express';
import { Body, Controller, Get, Param, Post, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
export class OrganizationController {
  private apiService = new ApiService();
  private mdviewer = APIS.find(api => api.name === 'mdviewer');
  private checklist = APIS.find(api => api.name === 'checklist');

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

  @Get('/org/:orgId/template')
  @OpenAPI({
    summary: 'Get templates for organization',
  })
  @ResponseSchema(OrgTemplateApiResponse)
  @UseBefore(authMiddleware)
  async getOrgTemplate(
    @Req() req: RequestWithUser,
    @Param('orgId') orgId: number,
    @Res() response: Response<OrgTemplateApiResponse>,
  ): Promise<Response<OrgTemplateApiResponse>> {
    const { name } = req.user;
    if (!name) {
      throw new HttpException(400, 'Bad Request');
    }

    try {
      const data = await this.apiService.get<Organization[]>(
        {
          url: `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/organizations`,
          params: {
            organizationFilter: orgId,
          },
        },
        req.user,
      );
      if (data?.data?.[0]) {
        return response.send({ data: data.data[0], message: 'success' });
      } else {
        throw new HttpException(404, 'Could not find organization');
      }
    } catch (e) {
      throw new HttpException(e?.status || 500, e?.message || 'Internal server error');
    }
  }

  @Post('/org/templates')
  @OpenAPI({
    summary: 'Get templates for multiple organization',
  })
  @ResponseSchema(OrganizationsApiResponse)
  @UseBefore(authMiddleware)
  async getOrgTemplates(
    @Req() req: RequestWithUser,
    @Body() orgIds: string[],
    @Res() response: Response<OrganizationsApiResponse>,
  ): Promise<Response<OrganizationsApiResponse>> {
    const { name } = req.user;
    if (!name || !orgIds) {
      throw new HttpException(400, 'Bad Request');
    }

    const query = orgIds.map(id => `organizationFilter=${id}`).join('&');

    try {
      const data = await this.apiService.get<Organization[]>(
        {
          url: `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/organizations?${query}`,
        },
        req.user,
      );
      if (data?.data?.length > 0) {
        return response.send({ data: data.data, message: 'success' });
      } else {
        throw new HttpException(404, 'Could not find organization');
      }
    } catch (e) {
      throw new HttpException(e?.status || 500, e?.message || 'Internal server error');
    }
  }
}
