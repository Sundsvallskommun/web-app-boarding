import { OrganizationTree } from '@/data-contracts/mdviewer/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

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
  @IsNumber()
  parentId?: number;
  @ValidateNested({ each: true })
  @Type(() => OrgTree)
  @IsOptional()
  organizations?: OrgTree[];
}

export class OrgTreeApiResponse implements ApiResponse<OrgTree> {
  @ValidateNested()
  @Type(() => OrgTree)
  data: OrgTree;
  @IsString()
  message: string;
}
