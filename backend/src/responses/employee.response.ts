import ApiResponse from '@/interfaces/api-service.interface';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import { PortalPersonData } from '@/data-contracts/employee/data-contracts';

export class Employee implements PortalPersonData {
  @IsString()
  personid?: string;
  @IsString()
  givenname?: string | null;
  @IsString()
  lastname?: string | null;
  @IsString()
  fullname?: string | null;
  @IsString()
  address?: string | null;
  @IsString()
  postalCode?: string | null;
  @IsString()
  city?: string | null;
  @IsString()
  workPhone?: string | null;
  @IsString()
  mobilePhone?: string | null;
  @IsString()
  extraMobilePhone?: string | null;
  @IsString()
  aboutMe?: string | null;
  @IsString()
  email?: string | null;
  @IsString()
  mailNickname?: string | null;
  @IsString()
  company?: string | null;
  @IsNumber()
  companyId?: number;
  @IsString()
  orgTree?: string | null;
  @IsString()
  referenceNumber?: string | null;
  @IsBoolean()
  isManager?: boolean;
  @IsString()
  loginName?: string | null;
}

export class EmployeeApiResponse implements ApiResponse<Employee> {
  @ValidateNested()
  @Type(() => Employee)
  data: Employee;
  @IsString()
  message: string;
}
