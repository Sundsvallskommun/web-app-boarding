import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseBefore } from 'routing-controllers';
import ApiService from '@services/api.service';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import authMiddleware from '@middlewares/auth.middleware';
import {
  Checklist,
  CustomTaskCreateRequest,
  EmployeeChecklist,
  EmployeeChecklistTaskUpdateRequest,
  Mentor,
} from '@/data-contracts/checklist/data-contracts';
import { HttpException } from '@exceptions/HttpException';
import { DelegatedEmployeeChecklistResponse, EmployeeChecklistApiResponse } from '@/responses/checklist.response';
import ApiResponse from '@interfaces/api-service.interface';

interface ResponseData<T> {
  data: T;
  status: number;
  message: string;
}

@Controller()
export class ChecklistController {
  private apiService = new ApiService();

  @Get('/checklists')
  @OpenAPI({ summary: 'Fetch all checklists' })
  async getAllChecklists(): Promise<ResponseData<Checklist>> {
    const url = `/checklist/1.0/2281/checklists`;
    const res = await this.apiService.get<Checklist>({ url });

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Get('/employee-checklists/manager/:username')
  @OpenAPI({ summary: 'Fetch checklists as manager' })
  @ResponseSchema(EmployeeChecklistApiResponse)
  @UseBefore(authMiddleware)
  async getChecklistsAsManager(@Param('username') username: string): Promise<ResponseData<EmployeeChecklist[]>> {
    if (!username) {
      throw new HttpException(400, 'Bad request');
    }
    const url = `checklist/1.0/2281/employee-checklists/manager/${username}`;
    const res = await this.apiService.get<EmployeeChecklist[]>({ url });

    if (Array.isArray(res.data) && res.data.length < 1) {
      throw new HttpException(404, 'Data not found');
    }

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Get('/employee-checklists/employee/:username')
  @OpenAPI({ summary: 'Fetch checklists as employee' })
  @ResponseSchema(EmployeeChecklistApiResponse)
  @UseBefore(authMiddleware)
  async getChecklistsAsEmployee(@Param('username') username: string): Promise<ResponseData<EmployeeChecklist>> {
    const url = `checklist/1.0/2281/employee-checklists/employee/${username}`;
    const res = await this.apiService.get<EmployeeChecklist>({ url });

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Get('/employee-checklists/delegated-to/:username')
  @OpenAPI({ summary: 'Fetch delegated checklists' })
  @ResponseSchema(DelegatedEmployeeChecklistResponse)
  @UseBefore(authMiddleware)
  async getDelegatedChecklists(@Param('username') username: string): Promise<ResponseData<DelegatedEmployeeChecklistResponse>> {
    if (!username) {
      throw new HttpException(400, 'Bad request');
    }
    const url = `checklist/1.0/2281/employee-checklists/delegated-to/${username}`;
    const res = await this.apiService.get<DelegatedEmployeeChecklistResponse>({ url });

    return { data: res.data, status: res.status, message: 'success' };
  }

  @Patch('/employee-checklists/:employeeChecklistId/tasks/:taskId')
  @OpenAPI({ summary: 'Update fulfilment status of a task' })
  @UseBefore(authMiddleware)
  async updateTaskFulfilmentStatus(
    @Param('employeeChecklistId') checklistId: string,
    @Param('taskId') taskId: string,
    @Body() data: EmployeeChecklistTaskUpdateRequest,
  ): Promise<ResponseData<EmployeeChecklistTaskUpdateRequest>> {
    const url = `checklist/1.0/2281/employee-checklists/${checklistId}/tasks/${taskId}`;
    return await this.apiService.patch<EmployeeChecklistTaskUpdateRequest>({ url, data });
  }

  @Post('/employee-checklists/:employeeChecklistId/phases/:phaseId/customtasks')
  @OpenAPI({ summary: 'Add custom task to specific checklist' })
  @UseBefore(authMiddleware)
  async addCustomTask(
    @Param('employeeChecklistId') checklistId: string,
    @Param('phaseId') phaseId: string,
    @Body() data: CustomTaskCreateRequest,
  ): Promise<ResponseData<CustomTaskCreateRequest>> {
    const url = `checklist/1.0/2281/employee-checklists/${checklistId}/phases/${phaseId}/customtasks`;
    return await this.apiService.post<CustomTaskCreateRequest>({ url, data });
  }

  @Post('/employee-checklists/:employeeChecklistId/delegate-to/:email')
  @OpenAPI({ summary: 'Delegate a specific checklist to an employee' })
  @UseBefore(authMiddleware)
  async delegateChecklist(@Param('employeeChecklistId') checklistId: string, @Param('email') email: string): Promise<{ status: number }> {
    const url = `checklist/1.0/2281/employee-checklists/${checklistId}/delegate-to/${email}`;
    return await this.apiService.post<{ status: number }>({ url });
  }

  @Delete('/employee-checklists/:employeeChecklistId/delegated-to/:email')
  @OpenAPI({ summary: 'Remove delegation from a specific checklist' })
  @UseBefore(authMiddleware)
  async removeDelegation(@Param('employeeChecklistId') checklistId: string, @Param('email') email: string): Promise<{ status: number }> {
    const url = `checklist/1.0/2281/employee-checklists/${checklistId}/delegated-to/${email}`;
    return await this.apiService.delete<{ status: number }>({ url });
  }

  @Put('/employee-checklists/:employeeChecklistId/mentor')
  @OpenAPI({ summary: 'Assign mentor to a specific employee checklist' })
  @UseBefore(authMiddleware)
  async assignMentor(@Param('employeeChecklistId') checklistId: string, @Body() data: Mentor): Promise<ApiResponse<EmployeeChecklist>> {
    const url = `checklist/1.0/2281/employee-checklists/${checklistId}/mentor`;
    return await this.apiService.put<EmployeeChecklist>({ url, data });
  }

  @Delete('/employee-checklists/:employeeChecklistId/mentor')
  @OpenAPI({ summary: 'Remove mentor from a specific employee checklist' })
  @UseBefore(authMiddleware)
  async removeMentor(@Param('employeeChecklistId') checklistId: string): Promise<ResponseData<EmployeeChecklist>> {
    const url = `checklist/1.0/2281/employee-checklists/${checklistId}/mentor`;
    return await this.apiService.delete<EmployeeChecklist>({ url });
  }
}
