import { APIS, MUNICIPALITY_ID } from '@/config';
import { Checklist, SortorderRequest as ISortorderRequest, Task as TaskType } from '@/data-contracts/checklist/data-contracts';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { ChecklistApiResponse, Task, TaskCreateRequest, TaskUpdateRequest } from '@/responses/checklist.response';
import { SortorderRequest } from '@/responses/template.response';
import ApiResponse from '@interfaces/api-service.interface';
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

  @Get('/templates/:id')
  @OpenAPI({ summary: 'Fetch checklist template by id' })
  @ResponseSchema(ChecklistApiResponse)
  async getChecklistsById(@Req() req: RequestWithUser, @Param('id') id: string): Promise<ResponseData<Checklist>> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists/${id}`;
    const res = await this.apiService.get<Checklist>({ url }, req.user);

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Put('/templates/sortorder/:orgid')
  @OpenAPI({ summary: 'Create or replace custom sort order for organization' })
  @ResponseSchema(SortorderRequest)
  @UseBefore(authMiddleware)
  async setSortorder(@Req() req: RequestWithUser, @Param('orgid') orgId: string, @Body() data: ISortorderRequest): Promise<ISortorderRequest> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/sortorder/${orgId}`;
    return this.apiService.put<SortorderRequest, ISortorderRequest>({ url, data }, req.user).then(response => data);
  }

  @Post('/templates/:checklistId/phases/:phaseId/tasks')
  @OpenAPI({ summary: 'Create a task' })
  @ResponseSchema(Task)
  @UseBefore(authMiddleware)
  async createTask(
    @Req() req: RequestWithUser,
    @Param('checklistId') checklistId: string,
    @Param('phaseId') phaseId: string,
    @Body() data: TaskCreateRequest,
  ): Promise<ResponseData<TaskType>> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists/${checklistId}/phases/${phaseId}/tasks`;
    return await this.apiService.post<Task, TaskCreateRequest>({ url, data }, req.user);
  }

  @Patch('/templates/:checklistId/phases/:phaseId/tasks/:taskId')
  @OpenAPI({ summary: 'Update a task' })
  @ResponseSchema(Task)
  @UseBefore(authMiddleware)
  async updateTask(
    @Req() req: RequestWithUser,
    @Param('checklistId') checklistId: string,
    @Param('phaseId') phaseId: string,
    @Param('taskId') taskId: string,
    @Body() data: TaskUpdateRequest,
  ): Promise<ResponseData<TaskType>> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists/${checklistId}/phases/${phaseId}/tasks/${taskId}`;
    return await this.apiService.patch<Task, TaskUpdateRequest>({ url, data }, req.user);
  }

  @Delete('/templates/:checklistId/phases/:phaseId/tasks/:taskId')
  @OpenAPI({ summary: 'Remove task' })
  @UseBefore(authMiddleware)
  async removeTask(
    @Req() req: RequestWithUser,
    @Param('checklistId') checklistId: string,
    @Param('phaseId') phaseId: string,
    @Param('taskId') taskId: string,
  ): Promise<{ status: number }> {
    const url = `${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/checklists/${checklistId}/phases/${phaseId}/tasks/${taskId}`;
    return await this.apiService.delete<{ status: number }>({ url }, req.user);
  }
}
