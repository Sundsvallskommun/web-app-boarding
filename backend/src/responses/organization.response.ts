import { Checklist, CommunicationChannel, Organization as OrganizationType } from '@/data-contracts/checklist/data-contracts';
import { OrganizationTree } from '@/data-contracts/mdviewer/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Template } from './template.response';
import { Organization } from './checklist.response';
import e from 'express';

export class OrgTree implements OrganizationTree {
  @IsString()
  organizationId?: string;
  @IsInt()
  orgId?: number;
  @IsInt()
  treeLevel?: number;
  @IsString()
  @IsOptional()
  orgDisplayName?: string;
  @IsString()
  @IsOptional()
  orgName?: string;
  @IsNumber()
  parentId?: number;
  @ValidateNested({ each: true })
  @Type(() => OrgTree)
  @IsOptional()
  organizations?: OrgTree[];
}

export class OrgTemplate implements OrganizationType {
  @IsString()
  id?: string;
  @IsString()
  organizationName?: string;
  @IsInt()
  organizationNumber?: number;
  @ValidateNested({ each: true })
  @Type(() => Template)
  checklists?: Checklist[];
  @IsEnum(CommunicationChannel)
  communicationChannels?: CommunicationChannel[];
  @IsDateString()
  created?: string;
  @IsDateString()
  updated?: string;
}

export class OrgTreeApiResponse implements ApiResponse<OrgTree> {
  @ValidateNested()
  @Type(() => OrgTree)
  data: OrgTree;
  @IsString()
  message: string;
}

export class OrganizationApiResponse implements ApiResponse<OrgTemplate[]> {
  @ValidateNested()
  @Type(() => OrgTemplate)
  data: OrgTemplate[];
  @IsString()
  message: string;
}

export class OrganizationsApiResponse implements ApiResponse<OrganizationType[]> {
  @ValidateNested({ each: true })
  @Type(() => Organization)
  data: Organization[];
  @IsString()
  message: string;
}

export class OrgTemplateApiResponse implements ApiResponse<OrgTemplate> {
  @ValidateNested()
  @Type(() => OrgTemplate)
  data: OrgTemplate;
  @IsString()
  message: string;
}
