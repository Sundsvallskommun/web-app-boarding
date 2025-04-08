import { OrganizationTree } from '@/data-contracts/company/data-contracts';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { hasOrgPermissions } from '@/middlewares/permissions.middleware';
import { Organization, OrganizationCreateRequest, OrganizationUpdateRequest } from '@/responses/checklist.response';
import { OrganizationApiResponse, OrganizationsApiResponse, OrgTemplateApiResponse, OrgTreeApiResponse } from '@/responses/organization.response';
import ApiService, { ApiResponse } from '@/services/api.service';
import { APIS, MUNICIPALITY_ID } from '@config';
import authMiddleware from '@middlewares/auth.middleware';
import { Response } from 'express';
import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Controller()
export class OrganizationController {
  private apiService = new ApiService();
  private company = APIS.find(api => api.name === 'company');
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
      const data = await this.apiService.get<OrganizationTree>(
        { url: `${this.company.name}/${this.company.version}/${MUNICIPALITY_ID}/${orgId}/orgtree` },
        req.user,
      );
      return response.send({ data: data.data, message: 'success' });
    } catch (e) {
      throw new HttpException(e?.status || 500, e?.message || 'Internal server error');
    }
  }

  @Get('/org/:orgId')
  @OpenAPI({
    summary: 'Get organization by id',
  })
  @ResponseSchema(OrganizationApiResponse)
  @UseBefore(authMiddleware)
  async getOrganization(
    @Req() req: RequestWithUser,
    @Param('orgId') orgId: number,
    @Res() response: Response<OrganizationApiResponse>,
  ): Promise<Response<OrganizationApiResponse>> {
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
      if (data?.data) {
        return response.send({ data: data.data, message: 'success' });
      } else {
        throw new HttpException(404, 'Could not find organization');
      }
    } catch (e) {
      throw new HttpException(e?.status || 500, e?.message || 'Internal server error');
    }
  }

  @Post('/org/:orgId')
  @OpenAPI({
    summary: 'Create an organization',
  })
  @ResponseSchema(ApiResponse<OrganizationCreateRequest>)
  @UseBefore(authMiddleware, hasOrgPermissions)
  async createOrganization(
    @Req() req: RequestWithUser,
    @Body() data: OrganizationCreateRequest,
    @Res() response: Response<ApiResponse<OrganizationCreateRequest>>,
  ): Promise<Response<ApiResponse<OrganizationCreateRequest>>> {
    const { name } = req.user;
    if (!name) {
      throw new HttpException(400, 'Bad Request');
    }

    try {
      const res = await this.apiService.post<never, OrganizationCreateRequest>(
        {
          url: `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/organizations`,
          data,
        },
        req.user,
      );
      return response.send({ data, message: 'success', status: res.status });
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

  @Post('/org/multiple/templates')
  @OpenAPI({
    summary: 'Get templates for multiple organization',
  })
  @ResponseSchema(OrganizationsApiResponse)
  @UseBefore(authMiddleware)
  async getOrgTemplates(
    @Req() req: RequestWithUser,
    @Body() body: { originOrg: string; orgIds: string[] },
    @Res() response: Response<OrganizationsApiResponse>,
  ): Promise<Response<OrganizationsApiResponse>> {
    const { name } = req.user;
    if (!name || !body.originOrg || !body.orgIds) {
      throw new HttpException(400, 'Bad Request');
    }

    let query = body.orgIds.map(id => `organizationFilter=${id}`).join('&');
    query += `&applySortFor=${body.originOrg}`;

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

  @Patch('/org/:orgId')
  @OpenAPI({ summary: 'Update communication channels' })
  @ResponseSchema(OrganizationsApiResponse)
  @UseBefore(authMiddleware)
  async updateCommunicationChannels(
    @Req() req: RequestWithUser,
    @Param('orgId') orgId: string,
    @Body() data: OrganizationUpdateRequest,
    @Res() response: Response<Organization>,
  ): Promise<ApiResponse<Organization>> {
    const { name } = req.user;
    if (!name || !data.communicationChannels) {
      throw new HttpException(400, 'Bad Request');
    }

    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/organizations/${orgId}`;
    return await this.apiService.patch<Organization, OrganizationUpdateRequest>({ url, data }, req.user);
  }
}
