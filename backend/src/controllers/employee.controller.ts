import { Controller, Get, Param, Req, UseBefore } from 'routing-controllers';
import ApiService from '@services/api.service';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import authMiddleware from '@middlewares/auth.middleware';
import { HttpException } from '@exceptions/HttpException';
import { PortalPersonData } from '@/data-contracts/employee/data-contracts';
import { EmployeeApiResponse } from '@/responses/employee.response';
import { RequestWithUser } from '@/interfaces/auth.interface';

interface ResponseData<T> {
  data: T;
  status: number;
  message: string;
}

@Controller()
export class EmployeeController {
  private apiService = new ApiService();

  @Get('/portalpersondata/personal/:username')
  @OpenAPI({ summary: 'Fetch employee' })
  @ResponseSchema(EmployeeApiResponse)
  @UseBefore(authMiddleware)
  async getEmployeeData(@Req() req: RequestWithUser, @Param('username') username: string): Promise<ResponseData<PortalPersonData>> {
    if (!req.user.username) {
      throw new HttpException(400, 'Bad request');
    }
    const url = `employee/1.0/portalpersondata/PERSONAL/${username}`;
    const res = await this.apiService.get<PortalPersonData>({ url }, req.user);
    return { data: res.data, status: res.status, message: 'success' };
  }
}
