import { LifeCycle, PhaseItem, SortorderRequest as ISortorderRequest, TaskItem } from '@/data-contracts/checklist/data-contracts';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Checklist, Phase } from './checklist.response';

export class Template implements Checklist {
  @IsString()
  id: string;
  @IsString()
  name?: string;
  @IsString()
  displayName?: string;
  @IsInt()
  version?: number;
  @IsEnum(LifeCycle)
  lifeCycle?: LifeCycle;
  @IsDateString()
  created?: string;
  @IsDateString()
  updated?: string;
  @IsString()
  lastSavedBy?: string;
  @ValidateNested({ each: true })
  @Type(() => Phase)
  phases?: Phase[];
}

export class CTaskItem implements TaskItem {
  @IsString()
  id: string;
  @IsNumber()
  position: number;
}

export class CPhaseItem implements PhaseItem {
  @IsOptional()
  @IsString()
  id?: string;
  @IsNumber()
  position: number;
  @ValidateNested({ each: true })
  @Type(() => CTaskItem)
  taskOrder?: TaskItem[];
}
export class SortorderRequest implements ISortorderRequest {
  @ValidateNested({ each: true })
  @Type(() => CPhaseItem)
  phaseOrder?: PhaseItem[];
}
