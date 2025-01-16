import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import ApiResponse from '@interfaces/api-service.interface';
import { Type } from 'class-transformer';
import {
  FulfilmentStatus,
  QuestionType,
  RoleType,
  Stakeholder as StakeholderType,
  Mentor as MentorType,
  CustomTaskCreateRequest as CustomTaskCreateRequestType,
  CommunicationChannel,
  OrganizationCreateRequest as OrganizationCreateRequestType,
  CustomTask as CustomTaskType,
  StatusType as StatusTypeType,
  Detail as DetailType,
  EmployeeChecklistResponse as EmployeeChecklistResponseType,
  ChecklistCreateRequest as ChecklistCreateRequestType,
  Permission,
  PhaseCreateRequest as PhaseCreateRequestType,
  TaskCreateRequest as TaskCreateRequestType,
  OrganizationUpdateRequest as OrganizationUpdateRequestType,
  LifeCycle,
  Checklist as ChecklistType,
  Organization as OrganizationType,
  Phase as PhaseType,
  Task as TaskType,
  EmployeeChecklistTaskUpdateRequest as EmployeeChecklistTaskUpdateRequestType,
  EmployeeChecklistPhaseUpdateRequest as EmployeeChecklistPhaseUpdateRequestType,
  CustomTaskUpdateRequest as CustomTaskUpdateRequestType,
  ChecklistUpdateRequest as ChecklistUpdateRequestType,
  PhaseUpdateRequest as PhaseUpdateRequestType,
  TaskUpdateRequest as TaskUpdateRequestType,
  CorrespondenceStatus,
  Correspondence as CorrespondenceType,
  DelegatedEmployeeChecklistResponse as DelegatedEmployeeChecklistResponseType,
  EmployeeChecklist as IEmployeeChecklist,
  EmployeeChecklistTask as IEmployeeChecklistTask,
} from '../data-contracts/checklist/data-contracts';

export class Stakeholder implements StakeholderType {
  @IsString()
  id?: string;
  @IsString()
  firstName?: string;
  @IsString()
  lastName?: string;
  @IsString()
  email?: string;
  @IsString()
  username?: string;
  @IsString()
  title?: string;
}

export class Mentor implements MentorType {
  @IsString()
  userId: string;
  @IsString()
  name: string;
}

export class EmployeeChecklistPhase implements EmployeeChecklistPhase {
  @IsString()
  id?: string;
  @IsString()
  name?: string;
  @IsString()
  bodyText?: string;
  @IsString()
  timeToComplete?: string;
  @IsEnum(RoleType)
  roleType?: RoleType;
  @IsNumber()
  sortOrder?: number;
  @ValidateNested({ each: true })
  @Type(() => EmployeeChecklistTask)
  tasks?: EmployeeChecklistTask[];
}

export class EmployeeChecklistTask implements IEmployeeChecklistTask {
  @IsString()
  id?: string;
  @IsString()
  heading?: string;
  @IsString()
  @IsOptional()
  headingReference?: string;
  @IsString()
  text?: string;
  @IsNumber()
  sortOrder?: number;
  @IsEnum(RoleType)
  roleType?: RoleType;
  @IsEnum(QuestionType)
  questionType?: QuestionType;
  @IsBoolean()
  customTask?: boolean;
  @IsString()
  responseText?: string;
  @IsEnum(FulfilmentStatus)
  fulfilmentStatus?: FulfilmentStatus;
  @IsString()
  updated?: string;
  @IsString()
  updatedBy?: string;
}

export class CustomTaskCreateRequest implements CustomTaskCreateRequestType {
  @IsString()
  heading: string;
  @IsString()
  headingReference?: string;
  @IsString()
  text?: string;
  @IsEnum(QuestionType)
  questionType: QuestionType;
  @IsNumber()
  sortOrder: number;
  @IsString()
  createdBy: string;
}

export class EmployeeChecklist implements IEmployeeChecklist {
  @IsString()
  id?: string;
  @ValidateNested()
  @Type(() => Stakeholder)
  employee?: Stakeholder;
  @ValidateNested()
  @Type(() => Stakeholder)
  manager?: Stakeholder;
  @IsBoolean()
  completed?: boolean;
  @IsBoolean()
  locked?: boolean;
  @ValidateNested()
  @Type(() => Mentor)
  mentor?: Mentor;
  @IsArray()
  @IsString({ each: true })
  delegatedTo?: string[];
  @ValidateNested({ each: true })
  @Type(() => EmployeeChecklistPhase)
  phases?: EmployeeChecklistPhase[];
  @IsString()
  created?: string;
  @IsString()
  updated?: string;
  @IsString()
  startDate?: string;
  @IsString()
  endDate?: string;
  @IsString()
  expirationDate?: string;
}

export class EmployeeChecklistApiResponse implements ApiResponse<EmployeeChecklist> {
  @ValidateNested()
  @Type(() => EmployeeChecklist)
  data: EmployeeChecklist;
  @IsString()
  message: string;
}

export class OrganizationCreateRequest implements OrganizationCreateRequestType {
  @IsString()
  organizationName: string;
  @IsNumber()
  organizationNumber: number;
  @IsEnum(CommunicationChannel, { each: true })
  @IsArray()
  communicationChannels?: CommunicationChannel[];
}

export class CustomTask implements CustomTaskType {
  @IsString()
  id?: string;
  @IsString()
  heading?: string;
  @IsString()
  @IsOptional()
  headingReference?: string;
  @IsString()
  text?: string;
  @IsNumber()
  sortOrder?: number;
  @IsEnum(RoleType)
  roleType?: RoleType;
  @IsEnum(QuestionType)
  questionType?: QuestionType;
  @IsString()
  created?: string;
  @IsString()
  updated?: string;
  @IsString()
  lastSavedBy?: string;
}

export class StatusType implements StatusTypeType {
  @IsNumber()
  statusCode?: number;
  @IsString()
  reasonPhrase?: string;
}

export class Detail implements DetailType {
  @ValidateNested()
  @Type(() => StatusType)
  status?: StatusType;
  @IsString()
  information?: string;
}

export class EmployeeChecklistResponse implements EmployeeChecklistResponseType {
  @IsString()
  summary?: string;
  @ValidateNested({ each: true })
  @Type(() => Detail)
  details?: Detail[];
}

export class ChecklistCreateRequest implements ChecklistCreateRequestType {
  @IsString()
  name: string;
  @IsString()
  displayName: string;
  @IsNumber()
  organizationNumber: number;
  @IsString()
  createdBy: string;
}

export class PhaseCreateRequest implements PhaseCreateRequestType {
  @IsString()
  name: string;
  @IsString()
  bodyText?: string;
  @IsString()
  timeToComplete?: string;
  @IsEnum(RoleType)
  roleType: RoleType;
  @IsEnum(Permission)
  permission: Permission;
  @IsNumber()
  sortOrder: number;
  @IsString()
  createdBy: string;
}

export class TaskCreateRequest implements TaskCreateRequestType {
  @IsString()
  heading: string;
  @IsString()
  @IsOptional()
  headingReference: string;
  @IsString()
  @IsOptional()
  text?: string;
  @IsNumber()
  sortOrder: number;
  @IsEnum(RoleType)
  roleType: RoleType;
  @IsEnum(Permission)
  permission: Permission;
  @IsEnum(QuestionType)
  questionType: QuestionType;
  @IsString()
  createdBy: string;
}

export class OrganizationUpdateRequest implements OrganizationUpdateRequestType {
  @IsString()
  organizationName?: string | null;
  @IsEnum(CommunicationChannel, { each: true })
  @IsArray()
  communicationChannels?: CommunicationChannel[];
}

export class Checklist implements ChecklistType {
  @IsString()
  id?: string;
  @IsEnum(RoleType)
  roleType?: RoleType;
  @IsString()
  name?: string;
  @IsString()
  displayName?: string;
  @IsNumber()
  version?: number;
  @IsEnum(LifeCycle)
  lifeCycle?: LifeCycle;
  @IsString()
  created?: string;
  @IsString()
  updated?: string;
  @IsString()
  lastSavedBy?: string;
  @ValidateNested({ each: true })
  @Type(() => Phase)
  phases?: Phase[];
}

export class ChecklistApiResponse implements ApiResponse<Checklist> {
  @ValidateNested()
  @Type(() => Checklist)
  data: Checklist;
  @IsString()
  message: string;
}

export class Organization implements OrganizationType {
  @IsString()
  id?: string;
  @IsString()
  organizationName?: string;
  @IsNumber()
  organizationNumber?: number;
  @ValidateNested({ each: true })
  @Type(() => Checklist)
  checklists?: Checklist[];
  @IsEnum(CommunicationChannel, { each: true })
  @IsArray()
  communicationChannels?: CommunicationChannel[];
  @IsString()
  created?: string;
  @IsString()
  updated?: string;
}

export class Phase implements PhaseType {
  @IsString()
  id?: string;
  @IsString()
  name?: string;
  @IsString()
  bodyText?: string;
  @IsString()
  timeToComplete?: string;
  @IsEnum(RoleType)
  roleType?: RoleType;
  @IsEnum(Permission)
  permission?: Permission;
  @IsNumber()
  sortOrder?: number;
  @ValidateNested({ each: true })
  @Type(() => Task)
  tasks?: Task[];
  @IsString()
  created?: string;
  @IsString()
  updated?: string;
  @IsString()
  lastSavedBy?: string;
}

export class Task implements TaskType {
  @IsString()
  id?: string;
  @IsString()
  heading?: string;
  @IsString()
  @IsOptional()
  headingReference?: string;
  @IsString()
  text?: string;
  @IsString()
  sortOrder?: number;
  @IsEnum(RoleType)
  roleType?: RoleType;
  @IsEnum(QuestionType)
  questionType?: QuestionType;
  @IsEnum(Permission)
  permission?: Permission;
  @IsString()
  created?: string;
  @IsString()
  updated?: string;
  @IsString()
  lastSavedBy?: string;
  @IsEnum(FulfilmentStatus)
  fulfilmentStatus?: FulfilmentStatus;
}

export class EmployeeChecklistTaskUpdateRequest implements EmployeeChecklistTaskUpdateRequestType {
  @IsEnum(FulfilmentStatus)
  fulfilmentStatus?: FulfilmentStatus;
  @IsString()
  responseText?: string | null;
  @IsString()
  updatedBy: string;
}

export class EmployeeChecklistPhaseUpdateRequest implements EmployeeChecklistPhaseUpdateRequestType {
  @IsEnum(FulfilmentStatus)
  tasksFulfilmentStatus?: FulfilmentStatus;
  @IsString()
  updatedBy: string;
}

export class CustomTaskUpdateRequest implements CustomTaskUpdateRequestType {
  @IsString()
  heading?: string;
  @IsString()
  @IsOptional()
  headingReference?: string;
  @IsString()
  @IsOptional()
  text?: string;
  @IsEnum(QuestionType)
  questionType?: QuestionType;
  @IsNumber()
  sortOrder?: number;
  @IsString()
  updatedBy: string;
}

export class ChecklistUpdateRequest implements ChecklistUpdateRequestType {
  @IsString()
  displayName?: string;
  @IsEnum(RoleType)
  roleType?: RoleType;
  @IsString()
  updatedBy: string;
}

export class PhaseUpdateRequest implements PhaseUpdateRequestType {
  @IsString()
  name?: string;
  @IsString()
  bodyText?: string;
  @IsString()
  timeToComplete?: string;
  @IsEnum(RoleType)
  roleType?: RoleType;
  @IsEnum(Permission)
  permission?: Permission;
  @IsNumber()
  sortOrder?: number;
  @IsString()
  updatedBy: string;
}

export class TaskUpdateRequest implements TaskUpdateRequestType {
  @IsString()
  heading?: string;
  @IsString()
  @IsOptional()
  headingReference?: string;
  @IsString()
  @IsOptional()
  text?: string;
  @IsNumber()
  sortOrder?: number;
  @IsEnum(RoleType)
  roleType?: RoleType;
  @IsEnum(Permission)
  permission?: Permission;
  @IsEnum(QuestionType)
  questionType?: QuestionType;
  @IsString()
  updatedBy: string;
}

export class Correspondence implements CorrespondenceType {
  @IsString()
  messageId?: string;
  @IsString()
  recipient?: string;
  @IsNumber()
  attempts?: number;
  @IsEnum(CorrespondenceStatus)
  correspondenceStatus?: CorrespondenceStatus;
  @IsEnum(CommunicationChannel)
  communicationChannel?: CommunicationChannel;
  @IsString()
  sent?: string;
}

export class DelegatedEmployeeChecklistResponse implements DelegatedEmployeeChecklistResponseType {
  @ValidateNested({ each: true })
  @Type(() => EmployeeChecklist)
  employeeChecklists?: EmployeeChecklist[];
}

export class OngoingEmployeeChecklist {
  @IsString()
  employeeName?: string;
  @IsString()
  employeeUsername?: string;
  @IsString()
  managerName?: string;
  @IsString()
  departmentName?: string;
  @IsArray()
  @IsString({ each: true })
  delegatedTo?: string[];
  @IsString()
  employmentDate?: string;
  @IsString()
  purgeDate?: string;
}

export class PagingMetaData {
  @IsNumber()
  page?: number;
  @IsNumber()
  limit?: number;
  @IsNumber()
  count?: number;
  @IsNumber()
  totalRecords?: number;
  @IsNumber()
  totalPages?: number;
}

export class OngoingEmployeeChecklists {
  @Type(() => OngoingEmployeeChecklist)
  checklists?: OngoingEmployeeChecklist[];
  @Type(() => PagingMetaData)
  _meta?: PagingMetaData;
}

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class OngoingEmployeeChecklistParameters {
  @IsNumber()
  page?: number;
  @IsNumber()
  limit?: number;
  @IsArray()
  @IsString({ each: true })
  sortBy?: string[];
  @IsEnum(Direction)
  sortDirection?: Direction;
  @IsString()
  employeeName?: string;
  @IsString()
  municipalityId?: string;
}
