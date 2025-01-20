import { Body, Controller, Delete, Get, Param, Patch, Post, Put, QueryParam, Req, UseBefore } from 'routing-controllers';
import ApiService from '@services/api.service';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import authMiddleware from '@middlewares/auth.middleware';
import {
  CustomTask,
  CustomTaskCreateRequest,
  CustomTaskUpdateRequest,
  EmployeeChecklist,
  EmployeeChecklistTask,
  EmployeeChecklistTaskUpdateRequest,
  Mentor,
} from '@/data-contracts/checklist/data-contracts';
import { HttpException } from '@exceptions/HttpException';
import { DelegatedEmployeeChecklistResponse, EmployeeChecklistApiResponse, OngoingEmployeeChecklists } from '@/responses/checklist.response';
import ApiResponse from '@interfaces/api-service.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { APIS, MUNICIPALITY_ID } from '@/config';

interface ResponseData<T> {
  data: T;
  status: number;
  message: string;
}

@Controller()
export class ChecklistController {
  private apiService = new ApiService();
  private checklist = APIS.find(api => api.name === 'checklist');

  @Get('/employee-checklists/manager/:username')
  @OpenAPI({ summary: 'Fetch checklists as manager' })
  @ResponseSchema(EmployeeChecklistApiResponse)
  @UseBefore(authMiddleware)
  async getChecklistsAsManager(@Req() req: RequestWithUser, @Param('username') username: string): Promise<ResponseData<EmployeeChecklist[]>> {
    if (!username) {
      throw new HttpException(400, 'Bad request');
    }
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/manager/${username}`;
    const res = await this.apiService.get<EmployeeChecklist[]>({ url }, req.user);

    if (Array.isArray(res.data) && res.data.length < 1) {
      throw new HttpException(404, 'Data not found');
    }

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Get('/employee-checklists/employee/:username')
  @OpenAPI({ summary: 'Fetch checklists as employee' })
  @ResponseSchema(EmployeeChecklistApiResponse)
  @UseBefore(authMiddleware)
  async getChecklistsAsEmployee(@Req() req: RequestWithUser, @Param('username') username: string): Promise<ResponseData<EmployeeChecklist>> {
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/employee/${username}`;
    const res = await this.apiService.get<EmployeeChecklist>({ url }, req.user);

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Get('/employee-checklists/delegated-to/:username')
  @OpenAPI({ summary: 'Fetch delegated checklists' })
  @ResponseSchema(DelegatedEmployeeChecklistResponse)
  @UseBefore(authMiddleware)
  async getDelegatedChecklists(
    @Req() req: RequestWithUser,
    @Param('username') username: string,
  ): Promise<ResponseData<DelegatedEmployeeChecklistResponse>> {
    if (!username) {
      throw new HttpException(400, 'Bad request');
    }
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/delegated-to/${req.user.username}`;
    const res = await this.apiService.get<DelegatedEmployeeChecklistResponse>({ url }, req.user);

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Get('/employee-checklists/ongoing')
  @OpenAPI({ summary: 'Fetch all ongoing checklists' })
  @ResponseSchema(OngoingEmployeeChecklists)
  @UseBefore(authMiddleware)
  async getAllOngoingChecklists(
    @Req() req: RequestWithUser,
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('employeeName') employeeName: string,
    @QueryParam('sortBy') sortBy: string,
    @QueryParam('sortDirection') sortDirection: string,
  ): Promise<ResponseData<OngoingEmployeeChecklists>> {
    let url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/ongoing?page=${page}&limit=${limit}&sortBy=${sortBy}&sortDirection=${sortDirection}&employeeName=${employeeName}`;

    return await this.apiService.get<OngoingEmployeeChecklists>({ url }, req.user);
  }

  @Patch('/employee-checklists/:employeeChecklistId/tasks/:taskId')
  @OpenAPI({ summary: 'Update fulfilment status of a task' })
  @UseBefore(authMiddleware)
  async updateTaskFulfilmentStatus(
    @Req() req: RequestWithUser,
    @Param('employeeChecklistId') checklistId: string,
    @Param('taskId') taskId: string,
    @Body() data: EmployeeChecklistTaskUpdateRequest,
  ): Promise<ResponseData<EmployeeChecklistTask>> {
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/${checklistId}/tasks/${taskId}`;
    return await this.apiService.patch<EmployeeChecklistTask, any>({ url, data }, req.user);
  }

  @Post('/employee-checklists/:employeeChecklistId/phases/:phaseId/customtasks')
  @OpenAPI({ summary: 'Add a custom task to specific checklist' })
  @UseBefore(authMiddleware)
  async addCustomTask(
    @Req() req: RequestWithUser,
    @Param('employeeChecklistId') checklistId: string,
    @Param('phaseId') phaseId: string,
    @Body() data: CustomTaskCreateRequest,
  ): Promise<ResponseData<CustomTask>> {
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/${checklistId}/phases/${phaseId}/customtasks`;
    return await this.apiService.post<CustomTask, CustomTaskCreateRequest>({ url, data }, req.user);
  }

  @Patch('/employee-checklists/:employeeChecklistId/customtasks/:taskId')
  @OpenAPI({ summary: 'Update a custom task' })
  @UseBefore(authMiddleware)
  async updateCustomTask(
    @Req() req: RequestWithUser,
    @Param('employeeChecklistId') checklistId: string,
    @Param('taskId') taskId: string,
    @Body() data: CustomTaskUpdateRequest,
  ): Promise<ResponseData<CustomTask>> {
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/${checklistId}/customtasks/${taskId}`;
    return await this.apiService.patch<CustomTask, CustomTaskUpdateRequest>({ url, data }, req.user);
  }

  @Delete('/employee-checklists/:employeeChecklistId/customtasks/:taskId')
  @OpenAPI({ summary: 'Remove custom task' })
  @UseBefore(authMiddleware)
  async removeCustomTask(
    @Req() req: RequestWithUser,
    @Param('employeeChecklistId') checklistId: string,
    @Param('taskId') taskId: string,
  ): Promise<{ status: number }> {
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/${checklistId}/customtasks/${taskId}`;
    return await this.apiService.delete<{ status: number }>({ url }, req.user);
  }

  @Post('/employee-checklists/:employeeChecklistId/delegate-to/:email')
  @OpenAPI({ summary: 'Delegate a specific checklist to an employee' })
  @UseBefore(authMiddleware)
  async delegateChecklist(
    @Req() req: RequestWithUser,
    @Param('employeeChecklistId') checklistId: string,
    @Param('email') email: string,
  ): Promise<{ status: number }> {
    const encodedEmail = encodeURIComponent(email);
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/${checklistId}/delegate-to/${encodedEmail}`;
    return await this.apiService.post<{ status: number }, any>({ url }, req.user);
  }

  @Delete('/employee-checklists/:employeeChecklistId/delegated-to/:email')
  @OpenAPI({ summary: 'Remove delegation from a specific checklist' })
  @UseBefore(authMiddleware)
  async removeDelegation(
    @Req() req: RequestWithUser,
    @Param('employeeChecklistId') checklistId: string,
    @Param('email') email: string,
  ): Promise<{ status: number }> {
    const encodedEmail = encodeURIComponent(email);
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/${checklistId}/delegated-to/${encodedEmail}`;
    return await this.apiService.delete<{ status: number }>({ url }, req.user);
  }

  @Put('/employee-checklists/:employeeChecklistId/mentor')
  @OpenAPI({ summary: 'Assign mentor to a specific employee checklist' })
  @UseBefore(authMiddleware)
  async assignMentor(
    @Req() req: RequestWithUser,
    @Param('employeeChecklistId') checklistId: string,
    @Body() data: Mentor,
  ): Promise<ApiResponse<EmployeeChecklist>> {
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/${checklistId}/mentor`;
    return await this.apiService.put<EmployeeChecklist, Mentor>({ url, data }, req.user);
  }

  @Delete('/employee-checklists/:employeeChecklistId/mentor')
  @OpenAPI({ summary: 'Remove mentor from a specific employee checklist' })
  @UseBefore(authMiddleware)
  async removeMentor(@Req() req: RequestWithUser, @Param('employeeChecklistId') checklistId: string): Promise<ResponseData<EmployeeChecklist>> {
    const url = `/${this.checklist.name}/${this.checklist.version}/${MUNICIPALITY_ID}/employee-checklists/${checklistId}/mentor`;
    return await this.apiService.delete<EmployeeChecklist>({ url }, req.user);
  }
}
