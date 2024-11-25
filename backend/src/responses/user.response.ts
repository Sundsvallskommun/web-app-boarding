import ApiResponse from '@/interfaces/api-service.interface';
import { ClientUser, InternalRole, InternalRoleEnum, Permissions as IPermissions } from '@/interfaces/users.interface';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsString, ValidateNested } from 'class-validator';

export class Permissions implements IPermissions {
  @IsBoolean()
  canEditAdmin: boolean;
  @IsBoolean()
  canViewAdmin: boolean;
}

export class User implements ClientUser {
  @IsString()
  name: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  username: string;
  @IsEnum(InternalRoleEnum)
  role: InternalRole;
  @ValidateNested()
  @Type(() => Permissions)
  permissions: Permissions;
}

export class UserApiResponse implements ApiResponse<User> {
  @ValidateNested()
  @Type(() => User)
  data: User;
  @IsString()
  message: string;
}
