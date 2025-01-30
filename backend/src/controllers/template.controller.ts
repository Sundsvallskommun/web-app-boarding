import { APIS, MUNICIPALITY_ID } from '@/config';
import { Checklist, SortorderRequest as ISortorderRequest, Task as TaskType, Events } from '@/data-contracts/checklist/data-contracts';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { hasOrgPermissions, hasOrgTemplatePermissions, hasSomePermission } from '@/middlewares/permissions.middleware';
import { ChecklistApiResponse, ChecklistCreateRequest, Task, TaskCreateRequest, TaskUpdateRequest } from '@/responses/checklist.response';
import { SortorderRequest } from '@/responses/template.response';
import { apiURL } from '@/utils/util';
import authMiddleware from '@middlewares/auth.middleware';
import ApiService from '@services/api.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

interface ResponseData<T> {
  data: T;
  status: number;
  message: string;
}

@Controller()
@UseBefore(authMiddleware, hasSomePermission(['canEditAdmin', 'canEditDepartment']))
export class TemplateController {
  private apiService = new ApiService();
  private checklist = APIS.find(api => api.name === 'checklist');

  @Get('/templates')
  @OpenAPI({ summary: 'Fetch all checklist templates' })
  async getAllChecklists(@Req() req: RequestWithUser): Promise<ResponseData<Checklist[]>> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists`;
    const res = await this.apiService.get<Checklist[]>({ url }, req.user);

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Get('/templates/:templateId')
  @OpenAPI({ summary: 'Fetch checklist template by id' })
  @ResponseSchema(ChecklistApiResponse)
  async getChecklistsById(@Req() req: RequestWithUser, @Param('templateId') templateId: string): Promise<ResponseData<Checklist>> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists/${templateId}`;
    const res = await this.apiService.get<Checklist>({ url }, req.user);

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Put('/org/:orgId/templates/:templateId/sortorder')
  @OpenAPI({ summary: 'Create or replace custom sort order for organization' })
  @ResponseSchema(SortorderRequest)
  @UseBefore(hasOrgPermissions)
  async setSortorder(@Req() req: RequestWithUser, @Param('orgid') orgId: string, @Body() data: ISortorderRequest): Promise<ISortorderRequest> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/sortorder/${orgId}`;
    return this.apiService.put<SortorderRequest, ISortorderRequest>({ url, data }, req.user).then(response => data);
  }

  @Post('/org/:orgId/templates/:templateId/phases/:phaseId/tasks')
  @OpenAPI({ summary: 'Create a task' })
  @ResponseSchema(Task)
  @UseBefore(hasOrgTemplatePermissions)
  async createTask(
    @Req() req: RequestWithUser,
    @Param('orgId') orgId: number,
    @Param('templateId') templateId: string,
    @Param('phaseId') phaseId: string,
    @Body() data: TaskCreateRequest,
  ): Promise<ResponseData<TaskType>> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists/${templateId}/phases/${phaseId}/tasks`;
    return await this.apiService.post<Task, TaskCreateRequest>({ url, data }, req.user);
  }

  @Patch('/org/:orgId/templates/:templateId/phases/:phaseId/tasks/:taskId')
  @OpenAPI({ summary: 'Update a task' })
  @ResponseSchema(Task)
  @UseBefore(hasOrgTemplatePermissions)
  async updateTask(
    @Req() req: RequestWithUser,
    @Param('orgId') orgId: number,
    @Param('templateId') templateId: string,
    @Param('phaseId') phaseId: string,
    @Param('taskId') taskId: string,
    @Body() data: TaskUpdateRequest,
  ): Promise<ResponseData<TaskType>> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists/${templateId}/phases/${phaseId}/tasks/${taskId}`;
    return await this.apiService.patch<Task, TaskUpdateRequest>({ url, data }, req.user);
  }

  @Delete('/org/:orgId/templates/:templateId/phases/:phaseId/tasks/:taskId')
  @OpenAPI({ summary: 'Remove task' })
  @UseBefore(hasOrgTemplatePermissions)
  async removeTask(
    @Req() req: RequestWithUser,
    @Param('orgId') orgId: number,
    @Param('templateId') templateId: string,
    @Param('phaseId') phaseId: string,
    @Param('taskId') taskId: string,
  ): Promise<{ status: number }> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists/${templateId}/phases/${phaseId}/tasks/${taskId}`;
    return await this.apiService.delete<{ status: number }>({ url }, req.user);
  }

  @Post('/org/:orgId/templates')
  @OpenAPI({ summary: 'Create a new template for organization' })
  @ResponseSchema(ChecklistApiResponse)
  @UseBefore(hasOrgPermissions)
  async createTemplate(@Req() req: RequestWithUser, @Body() data: ChecklistCreateRequest): Promise<ResponseData<Checklist>> {
    const baseURL = apiURL(`${this.checklist.name}/${this.checklist.version}`);
    const url = `${MUNICIPALITY_ID}/checklists`;

    const res = await this.apiService.post<never, ChecklistCreateRequest>({ url, baseURL, data }, req.user);

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Patch('/org/:orgId/templates/:templateId/activate')
  @OpenAPI({ summary: 'Activate checklist template' })
  @ResponseSchema(ChecklistApiResponse)
  @UseBefore(hasOrgTemplatePermissions)
  async activateChecklist(@Req() req: RequestWithUser, @Param('templateId') templateId: string): Promise<ResponseData<Checklist>> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists/${templateId}/activate`;
    const res = await this.apiService.patch<Checklist, never>({ url }, req.user);

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Post('/org/:orgId/templates/:templateId/version')
  @OpenAPI({ summary: 'Create new version of checklist template' })
  @ResponseSchema(ChecklistApiResponse)
  @UseBefore(hasOrgTemplatePermissions)
  async createNewVersion(@Req() req: RequestWithUser, @Param('templateId') templateId: string): Promise<ResponseData<Checklist>> {
    const baseURL = apiURL(`${this.checklist.name}/${this.checklist.version}`);
    const url = `${MUNICIPALITY_ID}/checklists/${templateId}/version`;
    const res = await this.apiService.post<Checklist, never>({ url, baseURL }, req.user);

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Get('/templates/:templateId/events')
  @OpenAPI({ summary: 'Fetch checklist template history by id' })
  @ResponseSchema(ChecklistApiResponse)
  async getTemplateHistory(@Req() req: RequestWithUser, @Param('templateId') templateId: string): Promise<ResponseData<Events>> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists/${templateId}/events?sort=created,DESC&size=25`;
    const res = await this.apiService.get<Events>({ url }, req.user);

    return { data: res.data, status: res.status, message: 'success' };
  }
}
