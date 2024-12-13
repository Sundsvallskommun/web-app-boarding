import { LifeCycle } from '@/data-contracts/checklist/data-contracts';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsString, ValidateNested } from 'class-validator';
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
